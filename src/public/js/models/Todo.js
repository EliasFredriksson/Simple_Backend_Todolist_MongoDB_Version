class Todo {
    constructor(entry) {
        this.id = entry._id;
        this.description = entry.description;
        this.date = new Date(entry.date);
        this.dateString =
            this.date.toLocaleDateString() +
            " - " +
            this.date.toLocaleTimeString();
        this.isFinished = entry.isFinished;
        this.prio = entry.prio;
    }
}

module.exports = Todo;
