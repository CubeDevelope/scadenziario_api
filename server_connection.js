const TYPES = require("tedious").TYPES;

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

const connections = [];

const _addConnection = async (connectedCallback) => {
  const connectionPosition = connections.length;
  connections.push(new Connection(config));
  await _connectConnection(
    (position = connectionPosition),
    (callback = () => {
      if (connectedCallback != null) connectedCallback(connectionPosition);
    })
  );
};

const _connectConnection = async (position, callback) => {
  await connections[position].connect((e) => {
    if (e) {
      console.log("Connection n°" + position + " not connected");
      throw e;
    } else {
      console.log("Connection n°" + position + " is connected");

      callback();
    }
  });
};

const _createQuery = async (query, callback) => {
  var readyConnection = null;

  const request = new Request(query, (e, rc, rws) => {
    callback(rws);
  });

  for (var i = 0; i < connections.length; i++) {
    const element = connections[i];
    if (element.state === element.STATE.LOGGED_IN) {
      readyConnection = element;
      break;
    }
  }

  if (readyConnection === null) {
    _addConnection((position) => {
      connections[position].execSql(request);
    });
  } else {
    readyConnection.execSql(request);
  }
};

module.exports = _createQuery;
