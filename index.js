const express = require("express");
const {
  getProceduresFromDB,
  getOperatorsFromDB,
  getActiviesFromDB,
  getRecurrenceFromDB,
  getActivityStatesFromDB,
  createNewActivity,
  deleteActivity,
  getProcedureTypesFromDB,
  createNewProcedure,
  createNewOperator,
  updateActivity,
  deleteOperator,
  deleteProcedure,
} = require("./data_requests");
const cors = require("cors");
const Activity = require("./models/activity");
const Procedure = require("./models/procedure");
const Operator = require("./models/operator");
const { Server } = require("socket.io");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + "/build"));

var operators = [];
var procedures = [];
var recurrence = [];
var activityStates = [];
var procedureTypes = [];

app.listen(port, () => {
  // Controllo che le tabelle esistano
  getOperatorsFromDB((rc) => {
    operators = rc;
  });

  getRecurrenceFromDB((rc) => {
    recurrence = rc;
  });

  getActivityStatesFromDB((rc) => {
    activityStates = rc;
  });

  getProcedureTypesFromDB((rc) => {
    procedureTypes = rc;
  });

  getProceduresFromDB((rc) => {
    procedures = rc;
  });
});

const ioServer = new Server(4000, {
  cors: {
    origin: "*",
  },
});

ioServer.on("connection", () => {});

// get
app.get("/getActivities", (req, res) => {
  getActiviesFromDB((rc) => {
    res.send({ status: 200, activities: rc });
  });
});

app.get("/getOperators", (req, res) => {
  getOperatorsFromDB((rc) => {
    operators = rc;
    res.send({ status: 200, operators: rc });
  });
});

app.get("/getProcedures", (req, res) => {
  getProceduresFromDB((rc) => {
    procedures = rc;
    res.send({ status: 200, procedures: rc });
  });
});

app.get("/getRecurrence", (req, res) => {
  if (recurrence.length != 0)
    res.send({ status: 200, recurrences: recurrence });
  else
    getRecurrenceFromDB((rc) => {
      recurrence = rc;
      res.send({ status: 200, recurrences: rc });
    });
});

app.get("/getActivityStates", (req, res) => {
  if (activityStates.length != 0)
    res.send({ status: 200, activityStates: activityStates });
  else
    getActivityStatesFromDB((rc) => {
      activityStates = rc;
      res.send({ status: 200, activityStates: rc });
    });
});

app.get("/getProcedureStates", (req, res) => {
  if (activityStates.length != 0)
    res.send({ status: 200, procedureTypes: procedureTypes });
  else
    getProcedureTypesFromDB((rc) => {
      activityStates = rc;
      res.send({ status: 200, procedureTypes: rc });
    });
});

app.get("/getConstantValues", (req, res) => {
  res.send({
    status: 200,
    operators: operators,
    activityStates: activityStates,
    recurrence: recurrence,
    procedures: procedures,
    procedureTypes: procedureTypes,
  });
});

// post

app.post("/createNewActivity", (req, res) => {
  const body = req.body;

  const activity = Activity.fromJson(body);

  createNewActivity("Activities", activity.toInsertQuery(), (rws) => {
    ioServer.sockets.emit("update_activities");
  });

  res.end();
});

app.post("/createNewProcedure", (req, res) => {
  const body = req.body;

  const procedure = Procedure.fromJson(body);

  createNewProcedure(procedure.toDBModel(), (rws) => {
    ioServer.sockets.emit("update_constants", "procedure");
  });
  res.end();
});

app.post("/createNewOperator", (req, res) => {
  const body = req.body;

  const operator = Operator.fromJson(body);

  createNewOperator(operator.toDBModel(), (rws) => {
    ioServer.sockets.emit("update_constants", "operator");
  });
  res.end();
});

// put

app.put("/updateActivity", (req, res) => {
  const body = req.body;

  const activity = Activity.fromJson(body);

  updateActivity(activity.toUpdateQuery(), activity.uid, () => {
    ioServer.sockets.emit("update_activities");
  });

  res.end();
});
// delete

app.delete("/deleteActivity", (req, res) => {
  const body = req.body;
  deleteActivity(
    "activities",
    body.uid,
    (callback = () => {
      ioServer.sockets.emit("update_activities");
    })
  );

  res.end();
});

app.delete("/deleteOperator", (req, res) => {
  const body = req.body;
  deleteOperator(
    "operators",
    body.uid,
    (callback = () => {
      ioServer.sockets.emit("update_constants", "operator");
    })
  );

  res.end();
});

app.delete("/deleteProcedure", (req, res) => {
  const body = req.body;
  deleteProcedure(
    "procedures",
    body.uid,
    (callback = () => {
      ioServer.sockets.emit("update_constants", "procedure");
    })
  );

  res.end();
});

app.get("*", (_, res) => {
  res.sendFile(__dirname + "/build" + "/index.html");
});
