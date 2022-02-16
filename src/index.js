const express = require("express");
const expressHandlebars = require("express-handlebars");
const path = require("path");
const Todo = require("./todo");
// Morgan is a tool to create more useful logging and debugging.
const morgan = require("morgan");
const CustomMorganToken = require("./Custom_Morgan_Token");

const app = express();
const port = 3000;
const hostname = "127.0.0.1";

// ################## REQUIRED CONFIG ##################
// Configure template Engine and Main Template File
app.engine(
    "hbs", // Vi skapar en motor i vår app som vi döper till "hbs".
    expressHandlebars.engine({
        defaultLayout: "main", // Default layout file
        extname: ".hbs", // Filename extension
    })
);
// Setting template engine
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); // Needed for forms to work.
// Static files
app.use(express.static("./src/public")); // Public folder. Css and  JS access.
app.use(express.json()); // Tells the server to expect request info to be in JSON format.
// Custom token for printing in the console whevener we recieve a request.
new CustomMorganToken(morgan, app).enable();
// ######################################################

const TodoHandler = new Todo.TodoHandler();

// ####################### ROUTES #######################
// Home
app.get("/", async (req, res) => {
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
app.post("/new", async (req, res) => {
    await TodoHandler.addTodo(
        req.body.newDescription,
        req.body.newDate,
        req.body.newTime,
        req.body.newPrio
    );
    res.status(300).redirect("/");
});

// Trigger sort
app.post("/sort/:group/:method", (req, res) => {
    if (req.params.group === "current") {
        TodoHandler.currentSort = req.params.method;
    } else if (req.params.group === "finished") {
        TodoHandler.finishedSort = req.params.method;
    }
    TodoHandler.verify();
    res.status(300).redirect("/");
});

// Go to edit page
app.get("/:id/edit", async (req, res) => {
    let todo = await TodoHandler.getById(req.params.id);
    res.status(200).render("todo-edit", {
        title: "Edit",
        todo: todo,
        layout: "edit",
    });
});

// Do the edit
app.post("/:id/edit", async (req, res) => {
    try {
        await TodoHandler.editTodo(
            req.params.id,
            "description",
            req.body.newDescription
        );
        await TodoHandler.editTodo(
            req.params.id,
            "date",
            req.body.newDate + " - " + req.body.newTime
        );
        await TodoHandler.editTodo(req.params.id, "prio", req.body.newPrio);
        TodoHandler.verify();
        res.status(300).redirect("/");
    } catch (error) {
        console.log("ERROR: ", error);
        res.status(400).redirect("/");
    }
});

// Mark todo as finished
app.post("/:id/done", async (req, res) => {
    try {
        await TodoHandler.editTodo(req.params.id, "isFinished", true);
        res.status(300).redirect("/");
    } catch (error) {
        console.log("ERROR: ", error);
        res.status(400).redirect("/");
    }
});

// Mark todo as not finished
app.post("/:id/undo", async (req, res) => {
    try {
        await TodoHandler.editTodo(req.params.id, "isFinished", false);
        res.status(300).redirect("/");
    } catch (error) {
        console.log("ERROR: ", error);
        res.status(400).redirect("/");
    }
});

// Delete todo
app.post("/:id/delete", async (req, res) => {
    try {
        await TodoHandler.deleteTodo(req.params.id);
        res.status(300).redirect("/");
    } catch (error) {
        console.log("ERROR: ", error);
        res.status(400).redirect("/");
    }
});

// ####################### LISTEN #######################
app.listen(port, hostname, () => {
    console.log(`Example app is running at: http://${hostname}:${port}`);
});
