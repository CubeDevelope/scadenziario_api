const {quoteString} = require("../utils");

class Procedure {
  constructor(uid, name, procedureTypeId) {
    this.uid = uid;
    this.name = name;
    this.procedureTypeId = procedureTypeId;
  }

  static fromJson(map) {
    return new Procedure(map["uid"], map["name"], map["procedureTypeId"]);
  }

  static fromDBModel(map) {
    return new Procedure(map[0].value, map[1].value, map[2].value);
  }

  toJson() {
    return {
      uid: this.uid,
      name: this.name,
      procedureTypeId: this.procedureTypeId,
    };
  }

  toDBModel() {
    return "(" + quoteString(this.name) + "," + this.procedureTypeId + ")";
  }
}

module.exports = Procedure;
