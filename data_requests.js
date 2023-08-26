const Operator = require("./models/operator");
const Procedure = require("./models/procedure");
const _createQuery = require("./server_connection");

const getActiviesFromDB = (callback) => {
  _createQuery("select * from activities", (rws) => {
    const activities = [];
    try {
      rws.forEach((element) => {
        console.log(element);
      });
    } catch (error) {
      throw e;
    }
  });
};

const getOperatorsFromDB = function (callback) {
  _createQuery("select * from operators", (rws) => {
    const operators = [];

    try {
      for (var i = 0; i < rws.length; i++) {
        operators.push(Operator.fromJson(rws[i]));
      }
    } catch (e) {
      console.log("Troppe richieste");
      console.log(e);
    }

    callback(operators);
  });
};

const getProceduresFromDB = (callback) => {
  _createQuery("select * from procedures", (rws) => {
    const procedures = [];

    try {
      for (var i = 0; i < rws.length; i++) {
        procedures.push(Procedure.fromJson(rws[i]));
      }
    } catch (e) {
      console.log("Troppe richieste");
      throw e;
    }
    callback(procedures);
  });
};

const getRecurrenceFromDB = (callback) => {
  _createQuery("select * from recurrence", (rws) => {
    const procedures = [];

    try {
      for (var i = 0; i < rws.length; i++) {
        procedures.push(Procedure.fromJson(rws[i]));
      }
    } catch (e) {
      console.log("Troppe richieste");
      throw e;
    }
    callback(procedures);
  });
};

const getActivityStatesFromDB = (callback) => {
  _createQuery("select * from activitystate", (rws) => {
    const procedures = [];

    try {
      for (var i = 0; i < rws.length; i++) {
        procedures.push(Procedure.fromJson(rws[i]));
      }
    } catch (e) {
      console.log("Troppe richieste");
      throw e;
    }
    callback(procedures);
  });
};

module.exports = {
  getOperatorsFromDB,
  getActiviesFromDB,
  getProceduresFromDB,
  getRecurrenceFromDB,
  getActivityStatesFromDB,
};
