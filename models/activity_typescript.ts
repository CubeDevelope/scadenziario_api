class Activity {
  uid: number;
  creationDate: Date;
  name: string;
  ordinary?: number;
  other?: string;
  deadline: Date;
  operator: number;
  progress: number;
  notes: string;

  constructor(
    uid: number,
    creationDate: Date,
    name: string,
    deadline: Date,
    operator: number,
    progress: number,
    notes: string,
    ordinary?: number,
    other?: string
  ) {
    this.uid = uid;
    this.creationDate = creationDate;
    this.name = name;
    this.ordinary = ordinary;
    this.other = other;
    this.deadline = deadline;
    this.operator = operator;
    this.progress = progress;
    this.notes = notes;
  }

  static fromJson(map : Map<String, any>) {

  }

  toJson() {
    return {
      date: this.creationDate.toString(),
      name: this.name,
      ordinary: this.ordinary,
      other: this.other,
      deadline: this.deadline.toString(),
      operator: this.operator,
      progress: this.progress,
      notes: this.notes,
    };
  }

  toDBModel() {
    return this.toJson.toString();
  }
}

module.exports = Activity;
