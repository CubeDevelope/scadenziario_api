const { query } = require("express");
const Operator = require("./models/operator");

const Connection = require("tedious").Connection;
const Request = require("tedious").Request;
var config = {
  server: "0.0.0.0",
  authentication: {
    type: "default",
    options: {
      userName: "sa",
      password: "MSSQL2022_llb",
    },
  },
  options: {
    database: "Scadenziario",
    port: 1433,
    trustServerCertificate: true,
    rowCollectionOnRequestCompletion: true,
  },
};

const connection = new Connection(config);

connection.connect((e) => {
  if (e) {
    throw e;
  } else {
    console.log("Connected 1");
  }
});

function _createQuery(query, callback) {
  const request = new Request(query, (e, rc, rws) => {
    console.log("Entrato" + rc);

    if (e) throw e;
    callback(rws);
  });

  connection.execSql(request);
}

const getActiviesFromDB = (callback) => {
  _createQuery("select * from activities");
};

const getOperators = function (callback) {
  _createQuery("select * from operators", (rws) => {
    const operators = [];

    try {
      for (var i = 0; i < rws.length; i++) {
        operators.push(Operator.fromJson(rws[i]));
      }
    } catch (e) {
      console.log(e);
    }

    callback(operators);
  });
};

module.exports = { getOperators, getActiviesFromDB };
