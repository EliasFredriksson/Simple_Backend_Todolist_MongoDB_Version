const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const { checkValidTodo } = require("../utils");
const tHand = require("../TodoHandler");
const TodoHandler = new tHand();

router.get("/", async (req, res) => {
    TodoHandler.verify();
    let isCurrentEmpty = true;
    let isFinishedEmpty = true;
    if (TodoHandler.current.length > 0) isCurrentEmpty = false;
    if (TodoHandler.finished.length > 0) isFinishedEmpty = false;

    res.status(200).render("todos", {
        showModalButton: true,
        title: "Todos",
        todosCurrent: TodoHandler.current,
        todosFinished: TodoHandler.finished,
        isCurrentEmpty: isCurrentEmpty,
        isFinishedEmpty: isFinishedEmpty,
    });
});

// Create new todo
router.post("/new", async (req, res) => {
    if (
        checkValidTodo(
            req.body.newDescription,
            req.body.newDate,
            req.body.newTime,
            req.body.newPrio
        )
    ) {
        await TodoHandler.addTodo(
            req.body.newDescription,
            req.body.newDate,
            req.body.newTime,
            req.body.newPrio
        );
        res.status(300).redirect("/todos/");
    } else {
        res.status(400).send("Invalid data provided.");
    }
});

// Trigger sort
router.post("/sort/:group/:method", (req, res) => {
    if (req.params.group === "current") {
        TodoHandler.currentSort = req.params.method;
    } else if (req.params.group === "finished") {
        TodoHandler.finishedSort = req.params.method;
    }
    res.status(300).redirect("/todos/");
});

// Go to edit page
router.get("/:id/edit", checkValidId, async (req, res) => {
    let todo = await TodoHandler.getById(req.params.id);
    res.status(200).render("todos-edit", {
        title: "Edit",
        todo: todo,
        date: todo.date.toLocaleDateString(),
        time: todo.date.toLocaleTimeString(),
        layout: "edit",
    });
});

// Do the edit
router.post("/:id/edit", checkValidId, async (req, res) => {
    try {
        let id = req.params.id;
        let desc = req.body.newDescription;
        let dateTime = req.body.newDate + ":" + req.body.newTime;
        let prio = req.body.newPrio;
        if (checkValidTodo(desc, req.body.newDate, req.body.newTime, prio)) {
            await TodoHandler.editTodo(id, "description", desc);
            await TodoHandler.editTodo(id, "date", dateTime);
            await TodoHandler.editTodo(id, "prio", prio);
            res.status(300).redirect("/todos/");
        } else {
            res.status(400).send("Invalid data provided.");
        }
    } catch (error) {
        console.log("ERROR: ", error);
        res.status(400).redirect("/todos/");
    }
});

// Mark todo as finished
router.post("/:id/done", checkValidId, async (req, res) => {
    try {
        await TodoHandler.editTodo(req.params.id, "isFinished", true);
        res.status(300).redirect("/todos/");
    } catch (error) {
        console.log("ERROR: ", error);
        res.status(400).redirect("/todos/");
    }
});

// Mark todo as not finished
router.post("/:id/undo", checkValidId, async (req, res) => {
    try {
        await TodoHandler.editTodo(req.params.id, "isFinished", false);
        res.status(300).redirect("/todos/");
    } catch (error) {
        console.log("ERROR: ", error);
        res.status(400).redirect("/todos/");
    }
});

// Delete todo
router.post("/:id/delete", checkValidId, async (req, res) => {
    try {
        await TodoHandler.deleteTodo(req.params.id);
        res.status(300).redirect("/todos/");
    } catch (error) {
        console.log("ERROR: ", error);
        res.status(400).redirect("/todos/");
    }
});

function checkValidId(req, res, next) {
    try {
        ObjectId(req.params.id);
        next();
    } catch (error) {
        res.status(404).render("not-found", {
            code: "404",
            msg: "Invalid id.",
        });
    }
}

module.exports = router;
