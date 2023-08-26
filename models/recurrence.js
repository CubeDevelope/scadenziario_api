class Recurrence {
    constructor(uid, name) {
      this.uid = uid;
      this.name = name;
    }
  
    static fromJson(map) {
      return new Procedure(map[0].value, map[1].value);
    }
  
    toJson() {
      return {
        uid: this.uid,
        name: this.name,
      };
    }
  }
  
  module.exports = Recurrence;
  