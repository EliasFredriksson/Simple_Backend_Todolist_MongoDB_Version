const Todo = require("./public/js/models/Todo");
const { ObjectId } = require("mongodb");
const getDatabase = require("./database");

class TodoHandler {
    constructor() {
        this.currentSort = "prio_de";
        this.finishedSort = "prio_de";
        this.getTodos();
    }

    async getTodos() {
        this.db = await getDatabase();
        const data = this.db.collection("Todos").find().toArray();
        this.data = (await data).map((entry) => {
            return new Todo(entry);
        });
        this.verify();
    }

    async addTodo(description, date, time, prio) {
        await this.db.collection("Todos").insertOne({
            description: description,
            date: date + ":" + time,
            isFinished: false,
            prio: prio,
        });
        await this.getTodos();
    }

    async getById(id) {
        const todo = await this.db
            .collection("Todos")
            .findOne({ _id: ObjectId(id) });
        return new Todo(todo);
    }

    async editTodo(id, whichPropery, newValue) {
        await this.db.collection("Todos").updateOne(
            { _id: ObjectId(id) },
            {
                $set: {
                    [whichPropery]: newValue,
                },
            }
        );
        await this.getTodos();
    }

    async deleteTodo(id) {
        await this.db.collection("Todos").deleteOne({ _id: ObjectId(id) });
        await this.getTodos();
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

module.exports = TodoHandler;
