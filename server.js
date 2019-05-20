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

  return axios
    .get(url, { httpsAgent })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log("ERROR on loading '" + url + "' : " + error.message);
      throw(error);
    });
};

function insertRegularPollingStationQuery(info) {
    return {
        text: "INSERT INTO polling_place (nr, name, city_district, municipality, county, polling_place_type) VALUES($1, $2, $3, $4, $5, $6)",
        values: [
            info.nr,
            info.name,
            info.city_district,
            info.municipality,
            info.county,
            info.polling_place_type
        ]
    };
}

function insertSamiPollingStationQuery(info) {
    return {
        text: "INSERT INTO polling_place (nr, name, polling_place_type) VALUES($1, $2, $3) ON CONFLICT (nr) DO NOTHING",
        values: [
            info.nr,
            info.name,
            info.polling_place_type
        ]
    };
}

const runQuery = async client_query => {

  console.log("runQuery query " + JSON.stringify(client_query));

  pool.connect().then(client => {
    client
      .query(client_query.text, client_query.values)
      .then(res => {
        client.release();
        console.log("runQuery INSERTED : " + res.rows[0]);
      })
      .catch(e => {
        client.release();
        console.log("runQuery ERROR : " + e.stack);
      });
  })
  .catch(error => {
    console.log("runQuery ERROR on inserting '" + JSON.stringify(client_query) + "' : " + error.message);
  });
};

const processPollingPlace = async (parentInfo, pollingPlaceUrl, document) => {
  console.log("PollingPlace : " + pollingPlaceUrl);
  assert(apiParser.isLeafNode(document));
  const name = apiParser.getName(document);
  console.log(name);
  const info = apiParser.getPollingPlaceInfo(document, parentInfo);
  console.log("processPollingPlace " + JSON.stringify(info));

  if (apiParser.isSamiDistrict(document)) {
    assert(info.nr.length > 0);
    assert(info.name.length > 0);
    assert(info.city_district === '');
    assert(info.municipality === '');
    assert(info.county === '');
    assert(info.polling_place_type === apiParser.SAMI_POLLING_PLACE_TYPE);

    runQuery(insertSamiPollingStationQuery(info));
  } else {
    assert(info.nr.length > 0);
    assert(info.name.length > 0);
    assert(info.municipality.length > 0);
    assert(info.county.length > 0);
    assert(info.polling_place_type === apiParser.REGULAR_POLLING_PLACE_TYPE);

    // runQuery(insertRegularPollingStationQuery(info));
  }
};

const processCityDistrictPollingPlace = async (parentInfo, pollingPlaceUrl) => {
  getData(pollingPlaceUrl).then(document => {
    processPollingPlace(parentInfo, pollingPlaceUrl, document);
  })
  .catch(error => {
    console.log("ERROR on loading CityDistrictPollingPlace '" + pollingPlaceUrl + "' : " + error.message);
  });
};

const processCityDistrict = async (parentInfo, cityDistrictUrl, document, url) => {
    console.log("City District : " + cityDistrictUrl);
    assert(apiParser.isCityDistrict(document));
    const name = apiParser.getName(document);
    console.log(name);
    parentInfo.city_district = apiParser.getNumber(document);

    const links = apiParser.getLinks(document);
    links.map(link => {
        const pollingPlaceUrl = url + link.href;
        processCityDistrictPollingPlace(parentInfo, pollingPlaceUrl);
    });
};

const processSection = async (parentInfo, sectionUrl, url) => {
  getData(sectionUrl).then(document => {
    if (apiParser.isPollingPlace(document)) {
      processPollingPlace(parentInfo, sectionUrl, document);
    } else {
      processCityDistrict(parentInfo, sectionUrl, document, url);
    }
  })
  .catch(error => {
    console.log("ERROR on loading Section '" + sectionUrl + "' : " + error.message);
  });
};

const processMunicipality = async (parentInfo, municipalityUrl, url) => {
  getData(municipalityUrl).then(document => {
    console.log("Municipality : " + municipalityUrl);
    assert(apiParser.isMunicipality(document));
    const name = apiParser.getName(document);
    console.log(name);
    parentInfo.municipality = apiParser.getNumber(document);

    const links = apiParser.getLinks(document);
    links.map(link => {
      const districtUrl = url + link.href;
      processSection(parentInfo, districtUrl, url);
    });
  })
  .catch(error => {
    console.log("ERROR on loading Municipality '" + municipalityUrl + "' : " + error.message);
  });
};

const processCounty = async (countyUrl, document, url) => {
  console.log("County : " + countyUrl);
  assert(apiParser.isCounty(document));
  const county = apiParser.getName(document);
  console.log(county);
  const links = apiParser.getLinks(document);

  let parentInfo = {
    city_district: '',
    municipality: '',
    county: apiParser.getNumber(document)
  }

  links.map(link => {
    const municipalityUrl = url + link.href;
    processMunicipality(parentInfo, municipalityUrl, url);
  });
};

const processSamiDistrict = async (samiDistrictUrl, document) => {
  console.log("Sami District : " + samiDistrictUrl);
  assert(apiParser.isSamiDistrict(document));
  const samiDistrict = apiParser.getName(document);
  console.log(samiDistrict);

  let parentInfo = {
    city_district: '',
    municipality: '',
    county: ''
  };

  processPollingPlace(parentInfo, samiDistrictUrl, document);
};

const processRegion = async (regionUrl, url) => {
  getData(regionUrl).then(document => {
    if (apiParser.isSamiDistrict(document)) {
      processSamiDistrict(regionUrl, document);
    } else {
      processCounty(regionUrl, document, url);
    }
  })
  .catch(error => {
    console.log("ERROR on loading Region '" + regionUrl + "' : " + error.message);
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
  })
  .catch(error => {
    console.log("ERROR on loading Election '" + electionUrl + "' : " + error.message);
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
  })
  .catch(error => {
    console.log("ERROR on loading ElectionEvent '" + eventUrl + "' : " + error.message);
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
  })
  .catch(error => {
    console.log("ERROR on loading ElectionEventList '" + url + "' : " + error.message);
  });
};

const populateDatabase = async url => {
  processElectionEventList(url);
};

populateDatabase("https://valgresultat.no/api");
app.listen(port, function() {
  console.log("Example app listening on port " + port);
});
