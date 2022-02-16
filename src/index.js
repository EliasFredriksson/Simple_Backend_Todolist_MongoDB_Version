const express = require("express");
const expressHandlebars = require("express-handlebars");
const path = require("path");
const CustomMorganToken = require("./public/js/models/Custom_Morgan_Token");
// Morgan is a tool to create more useful logging and debugging.
const morgan = require("morgan");

const app = express();
const port = 3000;
const hostname = "127.0.0.1";

const Todo = require("./public/js/models/Todo");
const TodoHandler = new Todo.TodoHandler();
const Token = new CustomMorganToken(morgan, app);

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
Token.enable();
// ######################################################

// ####################### ROUTES #######################
// Home
app.get("/", (request, response) => {
    let isCurrentEmpty = true;
    let isFinishedEmpty = true;
    if (TodoHandler.current.length > 0) {
        isCurrentEmpty = false;
    }
    if (TodoHandler.finished.length > 0) {
        isFinishedEmpty = false;
    }

    response.status(200).render("home", {
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
app.post("/new", (request, response) => {
    TodoHandler.addTodo(
        request.body.newDescription,
        request.body.newDate,
        request.body.newTime,
        request.body.newPrio
    );
    response.status(300).redirect("/");
});

// Trigger sort
app.post("/sort/:group/:method", (request, response) => {
    if (request.params.group === "current") {
        TodoHandler.currentSort = request.params.method;
    } else if (request.params.group === "finished") {
        TodoHandler.finishedSort = request.params.method;
    }
    TodoHandler.verify();
    response.status(300).redirect("/");
});

// Go to edit page
app.get("/:id/edit", (request, response) => {
    let todo = TodoHandler.getById(request.params.id);
    response.status(200).render("todo-edit", {
        title: "Edit",
        todo: todo,
        layout: "edit",
    });
});

// Do the edit
app.post("/:id/edit", (request, response) => {
    if (
        TodoHandler.edit(
            parseInt(request.params.id),
            "description",
            request.body.newDescription
        ) &&
        TodoHandler.edit(
            parseInt(request.params.id),
            "date",
            request.body.newDate + " - " + request.body.newTime
        ) &&
        TodoHandler.edit(
            parseInt(request.params.id),
            "prio",
            request.body.newPrio
        )
    ) {
        TodoHandler.verify();
        response.status(300).redirect("/");
    } else {
        console.log(TodoHandler.error);
        response.status(400).redirect("/");
    }
});

// Mark todo as finished
app.post("/:id/done", (request, response) => {
    if (TodoHandler.edit(parseInt(request.params.id), "isFinished", true)) {
        TodoHandler.verify();
        response.status(300).redirect("/");
    } else {
        console.log(TodoHandler.error);
        response.statusCode(400).redirect("/");
    }
});

// Mark todo as not finished
app.post("/:id/undo", (request, response) => {
    if (TodoHandler.edit(parseInt(request.params.id), "isFinished", false)) {
        TodoHandler.verify();
        response.status(300).redirect("/");
    } else {
        console.log(TodoHandler.error);
        response.status(400).redirect("/");
    }
});

// Delete todo
app.post("/:id/delete", (request, response) => {
    if (TodoHandler.delete(parseInt(request.params.id))) {
        TodoHandler.verify();
        response.status(300).redirect("/");
    } else {
        console.log(TodoHandler.error);
        response.status(400).redirect("/");
    }
});

// ####################### LISTEN #######################
app.listen(port, hostname, () => {
    console.log(`Example app is running at: http://${hostname}:${port}`);
});
