const express = require("express");
const expressHandlebars = require("express-handlebars");
const path = require("path");
// Morgan is a tool to create more useful logging and debugging.
const morgan = require("morgan");
const CustomMorganToken = require("./public/js/models/Custom_Morgan_Token");
// Routers
const todoRouter = require("./routers/router-todo");

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
// Custom token for printing in the console whevener we recieve a request.
// Place this before any app.set app.use.
new CustomMorganToken(morgan, app).enable();
// Setting template engine
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views")); // Tells express where the views folder is located.
app.use(express.urlencoded({ extended: true })); // Needed for forms to work.
app.use(express.json()); // Tells the server to expect request info to be in JSON format.
// Static files
app.use(express.static("./src/public")); // Public folder. Css and  JS access.
app.use("/todo", todoRouter); // Tells the server to use our todoRouter on "/todo" urls.
// ####################### ROUTES #######################
app.get("/", (req, res) => {
    res.redirect("/todo");
});

// ####################### LISTEN #######################
app.listen(port, hostname, () => {
    console.log(`Example app is running at: http://${hostname}:${port}`);
});
