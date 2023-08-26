class ActivityState {
    constructor(uid, name) {
      this.uid = uid;
      this.name = name;
    }
  
    static fromJson(map) {
      return new ActivityState(map[0].value, map[1].value);
    }
  
    toJson() {
      return {
        uid: this.uid,
        name: this.name,
      };
    }
  }
  
  module.exports = ActivityState;
  