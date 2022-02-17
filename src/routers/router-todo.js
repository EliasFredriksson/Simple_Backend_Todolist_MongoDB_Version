const express = require("express");
const router = express.Router();
const tHand = require("../TodoHandler");
const TodoHandler = new tHand();

router.get("/", async (req, res) => {
    TodoHandler.verify();
    let isCurrentEmpty = true;
    let isFinishedEmpty = true;
    if (TodoHandler.current.length > 0) isCurrentEmpty = false;
    if (TodoHandler.finished.length > 0) isFinishedEmpty = false;

    res.status(200).render("home", {
        title: "Todos",
        todosCurrent: TodoHandler.current,
        todosFinished: TodoHandler.finished,
        isCurrentEmpty: isCurrentEmpty,
        isFinishedEmpty: isFinishedEmpty,
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
        let id = req.params.id;
        let desc = req.body.newDescription;
        let dateTime = req.body.newDate + ":" + req.body.newTime;
        let prio = req.body.newPrio;
        await TodoHandler.editTodo(id, "description", desc);
        await TodoHandler.editTodo(id, "date", dateTime);
        await TodoHandler.editTodo(id, "prio", prio);
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
