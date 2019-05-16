var express = require("express");
var bodyParser = require("body-parser");
const axios = require("axios");
const assert = require("assert");
var apiParser = require("./api-parser");

var port = process.env.PORT || 3000;
var app = express();
var cors = require("cors");
app.use(cors());
app.use(bodyParser.json());

const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({ error: message });
}

app.get("/api/election_events", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM election_event");
    const results = { election_events: result ? result.rows : null };
    res.status(200).json(results);
    client.release();
  } catch (err) {
    handleError(res, err.message, "Failed to get election events");
    res.send("Error " + err);
  }
});

app.get("/api/election_types", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM election_type");
    const results = { election_types: result ? result.rows : null };
    res.status(200).json(results);
    client.release();
  } catch (err) {
    handleError(res, err.message, "Failed to get election types");
    res.send("Error " + err);
  }
});

app.get("/api/elections", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM election");
    const results = { elections: result ? result.rows : null };
    res.status(200).json(results);
    client.release();
  } catch (err) {
    handleError(res, err.message, "Failed to get elections");
    res.send("Error " + err);
  }
});

app.get("/api/elections/:id", async (req, res) => {
  try {
    const client = await pool.connect();
    const id = parseInt(req.params.id);
    const result = await client.query("SELECT * FROM election WHERE id = $1", [
      id
    ]);
    const results = { elections: result ? result.rows : null };
    res.status(200).json(results);
    client.release();
  } catch (err) {
    handleError(res, err.message, "Failed to get election");
    res.send("Error " + err);
  }
});

var https = require("https");
const getData = async url => {
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false
    //       ca: fs.readFileSync(`${path}CA.pem`),
    //       cert: fs.readFileSync(`${path}CERT.pem`),
    //       key: fs.readFileSync(`${path}KEY.pem`),
  });

  return axios.get(url, { httpsAgent }).then(function(response) {
    return response.data;
  });
};

const processPollingPlace = async (pollingPlaceUrl, document) => {
  console.log("PollingPlace : " + pollingPlaceUrl);
  assert(apiParser.isLeafNode(document));
  const name = apiParser.getName(document);
  console.log(name);
};

const processCityDistrictPollingPlace = async pollingPlaceUrl => {
  getData(pollingPlaceUrl).then(document => {
    processPollingPlace(pollingPlaceUrl, document);
  });
};

const processCityDistrict = async (cityDistrictUrl, document, url) => {
    console.log("City District : " + cityDistrictUrl);
    assert(apiParser.isCityDistrict(document));
    const name = apiParser.getName(document);
    console.log(name);
    const links = apiParser.getLinks(document);
    links.map(link => {
        const pollingPlaceUrl = url + link.href;
        processCityDistrictPollingPlace(pollingPlaceUrl);
    });
};

const processSection = async (sectionUrl, url) => {
  getData(sectionUrl).then(document => {
    if (apiParser.isPollingPlace(document)) {
      processPollingPlace(sectionUrl, document);
    } else {
      processCityDistrict(sectionUrl, document, url);
    }
  });
};

const processMunicipality = async (municipalityUrl, url) => {
  getData(municipalityUrl).then(document => {
    console.log("Municipality : " + municipalityUrl);
    assert(apiParser.isMunicipality(document));
    const name = apiParser.getName(document);
    console.log(name);

    const links = apiParser.getLinks(document);
    links.map(link => {
      const districtUrl = url + link.href;
      processSection(districtUrl, url);
    });
  });
};

const processCounty = async (countyUrl, document, url) => {
  console.log("County : " + countyUrl);
  assert(apiParser.isCounty(document));
  const county = apiParser.getName(document);
  console.log(county);
  const links = apiParser.getLinks(document);

  links.map(link => {
    const municipalityUrl = url + link.href;
    processMunicipality(municipalityUrl, url);
  });
};

const processSamiDistrict = async (samiDistrictUrl, document) => {
  console.log("Sami District : " + samiDistrictUrl);
  assert(apiParser.isSamiDistrict(document));
  const samiDistrict = apiParser.getName(document);
  console.log(samiDistrict);
  processPollingPlace(samiDistrictUrl, document);
};

const processRegion = async (regionUrl, url) => {
  getData(regionUrl).then(document => {
    if (apiParser.isSamiDistrict(document)) {
      processSamiDistrict(regionUrl, document);
    } else {
      processCounty(regionUrl, document, url);
    }
  });
};

const processElection = async (electionUrl, url) => {
  getData(electionUrl).then(document => {
    console.log("Election : " + electionUrl);

    const links = apiParser.getLinks(document);
    links.map(link => {
      const regionUrl = url + link.href;
      processRegion(regionUrl, url);
    });
  });
};

const processElectionEvent = async (eventUrl, url) => {
  getData(eventUrl).then(document => {
    console.log("Election Event : " + eventUrl);

    const links = apiParser.getLinks(document);
    links.map(link => {
      const electionUrl = url + link.href;
      processElection(electionUrl, url);
    });
  });
};

const processElectionEventList = async url => {
  getData(url).then(document => {
    console.log(document);

    const links = apiParser.getLinks(document);
    links.map(link => {
      const eventUrl = url + link.href;
      processElectionEvent(eventUrl, url);
    });
  });
};

const populateDatabase = async url => {
  processElectionEventList(url);
};

populateDatabase("https://valgresultat.no/api");
app.listen(port, function() {
  console.log("Example app listening on port " + port);
});
