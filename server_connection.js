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
  connections.push(new Connection(config));
  const connectionPosition = connections.length - 1;

  await _connectConnection(connectionPosition, () => {
    if (connectedCallback != null) connectedCallback(connectionPosition);
  });
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

const _getConnection = (callback) => {
  var readyConnection = null;
  var actualConnectionPosition = -1;

  for (var i = 0; i < connections.length; i++) {
    const element = connections[i];

    if (element.state === element.STATE.LOGGED_IN) {
      readyConnection = element;
      actualConnectionPosition = i;

      break;
    }
  }

  if (readyConnection === null) {
    _addConnection((pos) => {
      callback(connections[pos], pos);
    });
  } else {
    callback(readyConnection, actualConnectionPosition);
  }
};

// Base queries

const _createQuery = async (query, callback) => {
  const request = new Request(query, (e, rc, rws) => {
    if (e) {
      throw e;
    }
    if (callback != null) callback(rws);
  });

  _getConnection((connection, pos) => {
    connection.execSql(request);
  });
};

const _execTransaction = () => {};

// Insert

const _insertRow = (tableName, row, callback) => {
  const query = "INSERT INTO " + tableName + " VALUES " + row;

  _createQuery(query, callback);
};

const _updateRow = (tableName, data, id, callback) => {
  const query =
    "UPDATE " + tableName + " SET " + data + " WHERE uid = '" + id + "'";

  _createQuery(query, callback);
};

const _deleteRows = (tableName, ids, callback) => {
  ids.forEach((id) => {
    const query = "DELETE FROM " + tableName + " WHERE uid = '" + id + "'";
    _createQuery(query);
  });

  callback();
};

const _selectQuery = (tableName, columns = [], callback) => {
  var query = "SELECT ";
  if (columns.length == 0) query += "*";
  else
    for (let index = 0; index < columns.length; index++) {
      query = columns[index];
      if (index !== columns.length - 1) query += ", ";
    }

  query += "  FROM " + tableName;
  return query;
};

module.exports = {
  _createQuery,
  _insertRow,
  _deleteRows,
  _updateRow,
  _selectQuery,
};
