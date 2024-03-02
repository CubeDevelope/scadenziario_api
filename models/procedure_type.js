class ProcedureType {
    constructor(uid, name, acronym) {
      this.uid = uid;
      this.name = name;
      this.acronym = acronym;
    }
  
    static fromJson(map) {
      return new ProcedureType(map[0].value, map[1].value, map[2].value);
    }
  
    toJson() {
      return {
        uid: this.uid,
        name: this.name,
        acronym: this.acronym,
      };
    }
  }
  
  module.exports = ProcedureType;