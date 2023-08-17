class Operator {
  constructor(uid, name) {
    this.name = name;
    this.uid = uid;
  }

  static fromJson(map) {
    return new Operator(map[0].value, map[1].value);
  }
}

module.exports = Operator;
