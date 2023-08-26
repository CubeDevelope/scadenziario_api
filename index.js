const express = require("express");
const {
  getProceduresFromDB,
  getOperatorsFromDB,
  getActiviesFromDB,
  getRecurrenceFromDB,
  getActivityStatesFromDB,
} = require("./data_requests");
const cors = require("cors");

const app = express();
const port = 4000;

app.use(cors());

var operators = [];
var procedures = [];
var recurrence = [];
var activityStates = [];

app.listen(port, () => {
  getProceduresFromDB((rc) => {
    procedures = rc;
  });
  getOperatorsFromDB((rc) => {
    operators = rc;
  });
  getRecurrenceFromDB((rc) => {
    recurrence = rc;
  });
  getActivityStatesFromDB((rc) => {
    activityStates = rc;
  });
});

app.get("/getActivities", (req, res) => {
  getActiviesFromDB((rc) => {
    res.send({ status: 200, activities: rc });
  });
});

app.get("/getOperators", (req, res) => {
  if (operators.length != 0) res.send({ status: 200, operators: operators });
  else
    getOperatorsFromDB((rc) => {
      operators = rc;
      res.send({ status: 200, operators: rc });
    });
});

app.get("/getProcedures", (req, res) => {
  console.log("Procedures Length: " + procedures.length);
  if (procedures.length != 0) res.send({ status: 200, procedures: procedures });
  else
    getProceduresFromDB((rc) => {
      procedures = rc;
      res.send({ status: 200, procedures: rc });
    });
});

app.get("/getRecurrence", (req, res) => {
  if (recurrence.length != 0) res.send({ status: 200, activities: recurrence });
  else
    getRecurrenceFromDB((rc) => {
      recurrence = rc;
      res.send({ status: 200, recurrences: rc });
    });
});

app.get("/getActivityStates", (req, res) => {
  if (recurrence.length != 0) res.send({ status: 200, activityStates: activityStates });
  else
    getActivityStatesFromDB((rc) => {
      recurrence = rc;
      res.send({ status: 200, activityStates: rc });
    });
});
