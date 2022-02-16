const express = require("express");
const Todo = require("../todo");
const TodoHandler = new Todo.TodoHandler();

const router = express.Router();

router.get("/", async (req, res) => {
    await TodoHandler.getTodos();
    let isCurrentEmpty = true;
    let isFinishedEmpty = true;
    if (TodoHandler.current.length > 0) {
        isCurrentEmpty = false;
    }
    if (TodoHandler.finished.length > 0) {
        isFinishedEmpty = false;
    }

    res.status(200).render("home", {
        title: "Todos",
        todosCurrent: TodoHandler.current,
        todosFinished: TodoHandler.finished,
        isCurrentEmpty: isCurrentEmpty,
        isFinishedEmpty: isFinishedEmpty,
        sorts: [
            {
                title: "date in ascending order",
                method: "date_as",
                symbol: "fas fa-sort-amount-up",
            },
            {
                title: "date in descending order",
                method: "date_de",
                symbol: "fas fa-sort-amount-down-alt",
            },
            {
                title: "priority in ascending order",
                method: "prio_as",
                symbol: "fas fa-sort-up",
            },
            {
                title: "priority in descending order",
                method: "prio_de",
                symbol: "fas fa-sort-down",
            },
        ],
    });
});

// Create new todo
router.post("/new", async (req, res) => {
    await TodoHandler.addTodo(
        req.body.newDescription,
        req.body.newDate,
        req.body.newTime,
        req.body.newPrio
    );
    res.status(300).redirect("/");
});

// Trigger sort
router.post("/sort/:group/:method", (req, res) => {
    if (req.params.group === "current") {
        TodoHandler.currentSort = req.params.method;
    } else if (req.params.group === "finished") {
        TodoHandler.finishedSort = req.params.method;
    }
    res.status(300).redirect("/");
});

// Go to edit page
router.get("/:id/edit", async (req, res) => {
    let todo = await TodoHandler.getById(req.params.id);
    res.status(200).render("todo-edit", {
        title: "Edit",
        todo: todo,
        layout: "edit",
    });
});

// Do the edit
router.post("/:id/edit", async (req, res) => {
    try {
        await TodoHandler.editTodo(
            req.params.id,
            "description",
            req.body.newDescription
        );
        await TodoHandler.editTodo(
            req.params.id,
            "date",
            req.body.newDate + ":" + req.body.newTime
        );
        await TodoHandler.editTodo(req.params.id, "prio", req.body.newPrio);
        res.status(300).redirect("/");
    } catch (error) {
        console.log("ERROR: ", error);
        res.status(400).redirect("/");
    }
});

// Mark todo as finished
router.post("/:id/done", async (req, res) => {
    try {
        await TodoHandler.editTodo(req.params.id, "isFinished", true);
        res.status(300).redirect("/");
    } catch (error) {
        console.log("ERROR: ", error);
        res.status(400).redirect("/");
    }
});

// Mark todo as not finished
router.post("/:id/undo", async (req, res) => {
    try {
        await TodoHandler.editTodo(req.params.id, "isFinished", false);
        res.status(300).redirect("/");
    } catch (error) {
        console.log("ERROR: ", error);
        res.status(400).redirect("/");
    }
});

// Delete todo
router.post("/:id/delete", async (req, res) => {
    try {
        await TodoHandler.deleteTodo(req.params.id);
        res.status(300).redirect("/");
    } catch (error) {
        console.log("ERROR: ", error);
        res.status(400).redirect("/");
    }
});

module.exports = router;