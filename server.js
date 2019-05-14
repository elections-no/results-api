// var express = require("express");
// var port = process.env.PORT || 3000;
// var app = express();
// app.get('/', function (req, res) {
//  res.send(JSON.stringify({ Hello: 'World'}));
// });
// app.listen(port, function () {
//  console.log('Example app listening on port !');
// });


var express = require("express");
var bodyParser = require("body-parser");

var port = process.env.PORT || 3000;
var app = express();
app.use(bodyParser.json());

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}
  
app.get("/api/election_events", async (req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM election_event');
    const results = { 'results': (result) ? result.rows : null};
    res.status(200).json(results);
    client.release();
  } catch (err) {
    handleError(res, err.message, "Failed to get election events");
    res.send("Error " + err);
  }
});

app.get("/api/elections/:id", async (req, res) => {
//   try {
//     const client = await pool.connect()
//     const result = await client.query('SELECT * FROM elections WHERE id == '); // req.params.id
//     const results = { 'results': (result) ? result.rows : null};
//     res.status(200).json(results);
//     client.release();
//   } catch (err) {
//     handleError(res, err.message, "Failed to get election events");
//     res.send("Error " + err);
//   }
});

app.listen(port, function () {
  console.log('Example app listening on port !');
});