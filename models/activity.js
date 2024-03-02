const {quoteString} = require("../utils");

class Activity {
  /*
    uid : int
    creationDate: long
    proceduresId : int
    recurrenceId : int
    deadline: long
    operatorId : int
    stateId : int
    notes : int
  */

  constructor(
    uid,
    creationDate,
    procedureId,
    recurrenceId,
    alternativeName,
    deadline,
    operatorId,
    stateId,
    notes
  ) {
    this.uid = uid;
    this.creationDate = creationDate;
    this.procedureId = procedureId;
    this.recurrenceId = recurrenceId;
    this.alternativeName = alternativeName;
    this.deadline = deadline;
    this.operatorId = operatorId;
    this.stateId = stateId;
    this.notes = notes;
  }

  static fromJson(map) {
    return new Activity(
      map["uid"],
      map["creationDate"],
      map["procedureId"],
      map["recurrenceId"],
      map["alternativeName"],
      map["deadline"],
      map["operatorId"],
      map["stateId"],
      map["notes"]
    );
  }

  static fromDB(map) {
    const activity = new Activity();
    map.forEach(element => {
      switch(element.metadata.colName) {
        case "uid": activity.uid = element.value; break;
        case "creationDate": activity.creationDate = element.value; break;
        case "procedureId": activity.procedureId = element.value; break;
        case "recurrenceId": activity.recurrenceId = element.value; break;
        case "alternativeName": activity.alternativeName = element.value; break;
        case "deadline": activity.deadline = element.value; break;
        case "operatorId": activity.operatorId = element.value; break;
        case "stateId": activity.stateId = element.value; break;
        case "notes": activity.notes = element.value; break;
      } 
    });
    return activity;
    
  }

  toJson() {
    return {
      uid: this.uid,
      creationDate: this.creationDate,
      procedureId: this.procedureId,
      recurrenceId: this.recurrenceId,
      alternativeName: this.alternativeName,
      deadline: this.deadline,
      operatorId: this.operatorId,
      stateId: this.stateId,
      notes: this.notes,
    };
  }

  toUpdateQuery() {
    return (
      "operatorId = " +
      this.operatorId +
      ", deadline = " +
      this.deadline +
      ", stateId = " +
      this.stateId +
      ", notes = " +
      quoteString(this.notes)
    );
  }

  toInsertQuery() {
    return (
      "(" +
      this.creationDate +
      "," +
      this.procedureId +
      "," +
      this.recurrenceId +
      "," +
      quoteString(this.alternativeName) +
      "," +
      this.deadline +
      "," +
      this.operatorId +
      "," +
      this.stateId +
      "," +
      quoteString(this.notes) +
      ")"
    );
  }
}

module.exports = Activity;
