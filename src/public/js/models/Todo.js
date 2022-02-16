const Handler = require("./Handler");
const Data = require("./Data");
const Helpers = require("../../../utils");
class Todo extends Data {
    constructor(entry) {
        super();
        this.id = entry.id;
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

class TodoHandler extends Handler {
    constructor() {
        super("./src/data/todo-database.json", Todo);
        this.verify();
        this.currentSort = "Ascending";
        this.finishedSort = "Ascending";
    }

    addTodo(description, date, time, prio) {
        let newTodo = new Todo({
            id: Helpers.getNewId(this.data),
            description: description,
            date: date + ":" + time,
            isFinished: false,
            prio: prio,
        });
        this.data.push(newTodo);
        this.storeData();
        this.verify();
        return newTodo;
    }

    verify() {
        this.current = [];
        this.finished = [];
        this.data.forEach((todo) => {
            if (todo.isFinished) {
                this.finished.push(todo);
            } else {
                this.current.push(todo);
            }
        });
        this.__sort(this.current, this.currentSort);
        this.__sort(this.finished, this.finishedSort);
    }

    __sort(group, sortMethod) {
        switch (sortMethod) {
            case "date_as":
                group.sort((t1, t2) => t1.date - t2.date);
                break;
            case "date_de":
                group.sort((t1, t2) => t1.date - t2.date);
                group.reverse();
                break;
            case "prio_as":
                this.__prioSort(group);
                break;
            case "prio_de":
                this.__prioSort(group);
                group.reverse();
                break;
        }
    }

    __prioSort(group) {
        group.sort((e1, e2) => {
            if (e1.prio == "High") return -1;
            return 0;
        });
        group.sort((e1, e2) => {
            if (e1.prio == "Mid") return -1;
            return 0;
        });
        group.sort((e1, e2) => {
            if (e1.prio == "Low") return -1;
            return 0;
        });
    }
}

module.exports.Todo = Todo;
module.exports.TodoHandler = TodoHandler;
