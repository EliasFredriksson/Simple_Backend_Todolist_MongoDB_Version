const { ObjectId } = require("mongodb");
const getDatabase = require("./database");

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

class TodoHandler {
    constructor() {
        this.currentSort = "prio_as";
        this.finishedSort = "prio_as";
        this.getTodos();
    }

    async getTodos() {
        const db = await getDatabase();
        const data = db.collection("Todos").find().toArray();
        this.data = (await data).map((entry) => {
            return new Todo(entry);
        });
        this.verify();
    }

    async addTodo(description, date, time, prio) {
        const db = await getDatabase();
        db.collection("Todos").insertOne({
            description: description,
            date: date + ":" + time,
            isFinished: false,
            prio: prio,
        });
    }

    async getById(id) {
        const db = await getDatabase();
        const todo = await db
            .collection("Todos")
            .findOne({ _id: ObjectId(id) });
        console.log("TODO: ", todo);
        return new Todo(todo);
    }

    async editTodo(id, whichPropery, newValue) {
        const db = await getDatabase();
        db.collection("Todos").updateOne(
            { _id: ObjectId(id) },
            {
                $set: {
                    [whichPropery]: newValue,
                },
            }
        );
    }

    async deleteTodo(id) {
        const db = await getDatabase();
        await db.collection("Todos").deleteOne({ _id: ObjectId(id) });
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

module.exports = {
    Todo,
    TodoHandler,
};
