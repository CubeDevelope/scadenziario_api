const express = require("express");
const { getOperators } = require("./server_connection");


const app = express();
const port = 4000;

app.listen(port, () => {
});

app.get("/getActivities", (req, res) => {
  getOperators(rc => {
    res.send({status : 200, operators : rc});
  })
});
