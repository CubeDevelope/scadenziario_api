const Activity = require("./models/activity");
const Operator = require("./models/operator");
const Procedure = require("./models/procedure");
const Recurrence = require("./models/recurrence");
const ActivityState = require("./models/activity_state");

const {
  _createQuery,
  _insertRow,
  _deleteRows,
  _updateRow,
  _selectQuery,
} = require("./server_connection");
const ProcedureType = require("./models/procedure_type");
const { sortByString } = require("./utils");

// get

const getActiviesFromDB = (callback) => {
  // Effettua la chiamata al database
  _createQuery(_selectQuery("activities"), (rws) => {
    const activities = [];
    try {
      rws.forEach((element) => {
        activities.push(Activity.fromDB(element));
      });

      callback(activities);
    } catch (error) {
      console.error("Errore in getActiviesFromDB");
    }
  });
};

const getOperatorsFromDB = function (callback) {
  _createQuery("select * from operators", (rws) => {
    const operators = [];

    try {
      for (var i = 0; i < rws.length; i++) {
        operators.push(Operator.fromDBModel(rws[i]));
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
        procedures.push(Procedure.fromDBModel(rws[i]));
      }
    } catch (e) {
      console.log("Troppe richieste");
    }

    procedures.sort((a, b) => {
      return sortByString(a.name, b.name);
    });

    callback(procedures);
  });
};

const getRecurrenceFromDB = (callback) => {
  _createQuery("select * from recurrence", (rws) => {
    const recurrence = [];

    try {
      for (var i = 0; i < rws.length; i++) {
        recurrence.push(Recurrence.fromJson(rws[i]));
      }
    } catch (e) {
      console.log("Troppe richieste");
    }
    recurrence.sort((a, b) => {
      return sortByString(a.name, b.name);
    });
    callback(recurrence);
  });
};

const getActivityStatesFromDB = (callback) => {
  _createQuery("select * from activitystates", (rws) => {
    const activityStates = [];

    try {
      for (var i = 0; i < rws.length; i++) {
        activityStates.push(ActivityState.fromJson(rws[i]));
      }
    } catch (e) {
      console.log("Troppe richieste");
    }

    callback(activityStates);
  });
};

const getProcedureTypesFromDB = (callback) => {
  _createQuery("select * from proceduretypes", (rws) => {
    const procedureTypes = [];

    try {
      for (var i = 0; i < rws.length; i++) {
        procedureTypes.push(ProcedureType.fromJson(rws[i]));
      }
    } catch (e) {
      console.log("Troppe richieste");
    }
    callback(procedureTypes);
  });
};

// create

const createOperatorTable = (callback) => {
  const query =
    "IF OBJECT_ID('operators', 'U') IS NULL " +
    "CREATE TABLE operators(" +
    "uid int PRIMARY KEY IDENTITY (1,1)," +
    "name varchar (100) NOT NULL," +
    ");";
  _createQuery(query, callback);
};

const createRecurrenceTable = async (callback) => {
  const query =
    "IF OBJECT_ID('recurrence', 'U') IS NULL " +
    "CREATE TABLE recurrence(" +
    "uid INT PRIMARY KEY IDENTITY (1,1)," +
    "name varchar (200) NOT NULL," +
    ");";
  await _createQuery(query, callback);
};

const createActivityStatesTable = async (callback) => {
  const query =
    "IF OBJECT_ID('ActivityStates', 'U') IS NULL " +
    "CREATE TABLE ActivityStates(" +
    "uid INT PRIMARY KEY IDENTITY (1,1)," +
    "name [NVARCHAR](50) NOT NULL," +
    ");";
  await _createQuery(query, callback);
};

const createProceduresTable = (callback) => {
  const query =
    "IF OBJECT_ID('Procedures', 'U') IS NULL " +
    "CREATE TABLE Procedures(" +
    "uid int NOT NULL PRIMARY KEY IDENTITY(1,1), " +
    "name nvarchar (200) NOT NULL, " +
    "procedureTypeId int FOREIGN KEY " +
    "REFERENCES ProcedureTypes(uid) " +
    "ON UPDATE CASCADE" +
    ");";
  _createQuery(query, callback);
};

const createProcedureTypesTable = (callback) => {
  const query =
    "IF OBJECT_ID('ProcedureTypes', 'U') IS NULL " +
    "CREATE TABLE ProcedureTypes(" +
    "uid INT PRIMARY KEY IDENTITY (1,1)," +
    "NAME [NVARCHAR](70) NOT NULL," +
    "ACRONYM [NVARCHAR](10) NOT NULL," +
    ");";
  _createQuery(query, callback);
};

const populateProceduresType = (callback) => {
  const query =
    "INSERT INTO ProcedureTypes VALUES " +
    "('Fallimento', 'F'), " +
    "('Concordato preventivo', 'CP'), " +
    "('Liquidazione giudiziale', 'LG')," +
    "('Liquidazione controllata', 'LC')," +
    "('Liquidazione del patrimonio', 'LP')," +
    "('Accordo di ristrutturazione dei debiti del consumatore', 'ARD')";
  _createQuery(query, callback);
};

const populateActivityStates = (callback) => {
  const query =
    "INSERT INTO ActivityStates VALUES " +
    "(1, 'In corso'), " +
    "(2, 'In attesa'), " +
    "(3, 'Conclusa');";
  _createQuery(query, callback);
};

const populateRecurrence = (callback) => {
  const query =
    "INSERT INTO Recurrence VALUES " +
    "('Invio comunicazione di accettazione carica')," +
    "('Invio sentenza / decreto ai creditori ')," +
    "('Attivazione pec (pagamentop prebolla + firma contratto Zucchetti)')," +
    "('Pubblicazione sentenza nel portale dei Fallimenti di Vicenza')," +
    "('Trascrizione sentenza/decreto presso il PRA (per beni mobili registrati) con Agenzia Palladiana'),('Trascrizione sentenza/decreto presso la Conservatoria dei RR.II. (per i beni immobili) con Studio Giaretta')," +
    "('Comunicazione di nomina perito mobiliare')," +
    "('Comunicazione di nomina perito immobiliare')," +
    "('Istanza di autorizzazione a nomina legale')," +
    "('Istanza di autorizzazione a transazione')," +
    "('Elaborazione del programma di liquidazione')," +
    "('Invio al GD del programma di liquidazione')," +
    "('Nomina Comitato dei creditori')," +
    "('Istanza di autorizzazione ad esecuzione atto conforme al prog. liquidazione')," +
    "('Invio istanza di cancellazione gravami su beni immobili')," +
    "('Inviare mail a Studio Giaretta per preventivo onorario per pratica di cancellazione gravami (se spesa a carico aggiudicatario) ')," +
    "('Inviare mail a Studio Giaretta per conferimento incarico di pratica cancellazione gravami (se spesa a carico procedura) ')," +
    "('Inviare mail a Studio Giaretta dopo accettazione preventivo per formalizzazione conferimento incarico di pratica cancellazione gravami (se spesa a carico aggiudicatario) ')," +
    "('Consegnare a Studio Giaretta copia autentica ordinanza di cancellazione gravami + quietanza F24 (se pagata dalla procedura)'),('Consegnare a Studio Giaretta solo copia autentica ordinanza di cancellazione gravami (se F24 pagato dall acquirente)')," +
    "('Formazione progetto di stato passivo'),('Inviare ai creditori progetto di stato passivo'),('Inviare ai creditori comunicazione di arovazione stato passivo'),('Inviare ai creditori progetto di ripartizione parziale'),('Elaborare ed inviare ai creditori rendiconto della gestione')," +
    "('Elaborare ed inviare ai creditori rendiconto della gestione')," +
    "('Elaborare ed inviare al GD rendiconto della gestione')," +
    "('Inviare istanza di chiusura fallimento con cause pendenti')," +
    "('Inviare istanza di chiusura fallimento definitiva')";
  _createQuery(query, callback);
};

const createActiviesTable = (callback) => {
  const query =
    "IF OBJECT_ID('Activities', 'U') IS NULL " +
    "CREATE TABLE Activities(" +
    "uid INT NOT NULL IDENTITY(1,1) PRIMARY KEY, " +
    "creationDate bigint, " +
    "procedureId int, " +
    "recurrenceId int, " +
    "alternativeName nvarchar(50), " +
    "deadline bigint, " +
    "operatorId int, " +
    "stateId int, " +
    "notes nvarchar(1000), " +
    "CONSTRAINT FK_recurrences FOREIGN KEY (recurrenceId) REFERENCES recurrence (uid) on delete CASCADE on update CASCADE, " +
    "CONSTRAINT FK_procedures FOREIGN KEY (procedureId) REFERENCES Procedures (uid) on delete CASCADE on update CASCADE, " +
    "CONSTRAINT FK_operators FOREIGN KEY (operatorId) REFERENCES Operators (uid) on update CASCADE, " +
    "CONSTRAINT FK_activityState FOREIGN KEY (stateId) REFERENCES ActivityStates (uid) on update CASCADE" +
    ");";
  _createQuery(query, callback);
};

const createNewActivity = (activityName, activity, callback) => {
  _insertRow(activityName, activity, callback);
};

const createNewProcedure = (procedure, callback) => {
  _insertRow("Procedures", procedure, callback);
};

const createNewOperator = (operator, callback) => {
  _insertRow("Operators", operator, callback);
};
// update

const updateActivity = (activity, id, callback) => {
  _updateRow("Activities", activity, id, callback);
};
// delete

const deleteActivity = (tableName, id, callback) => {
  _deleteRows(tableName, [id], callback);
};

const deleteOperator = (tableName, id, callback) => {
  _deleteRows(tableName, [id], callback);
};

const deleteProcedure = (tableName, id, callback) => {
  _createQuerydeleteRows(tableName, [id], callback);
};

module.exports = {
  getOperatorsFromDB,
  getActiviesFromDB,
  getProceduresFromDB,
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

  createOperatorTable,
  createRecurrenceTable,
  createActivityStatesTable,
  createProceduresTable,
  createProcedureTypesTable,
  createActiviesTable,
  populateProceduresType,
  populateRecurrence,
  populateActivityStates,
};
