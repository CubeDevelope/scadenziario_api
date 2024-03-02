const {quoteString} = require("../utils");

class Operator {
  constructor(uid, name) {
    this.name = name;
    this.uid = uid;
  }

  static fromJson(map) {
    return new Operator(map['uid'], map['name']);
  }

  static fromDBModel(map) {
    return new Operator(map[0].value, map[1].value);
  }

  toDBModel() {
    return "(" + quoteString(this.name) + ")";
  }
}

module.exports = Operator;
