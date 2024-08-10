require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const { engine } = require("express-handlebars");
const path = require("path");
require("./db/conn");

const userRoute = require("./routes/userRoute");
const bookRoute = require("./routes/bookRoute");
require('./middleware/passport-config');

const app = express();

const port = process.env.PORT || 3000;

// Path for static files
const static_path = path.join(__dirname, "../public");

// Middleware setup
app.use(express.static(static_path));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Session setu
app.use(
    session({
        secret: "secretsession",
        cookie: { maxAge: 60000 },
        resave: false,
        saveUninitialized: false,
    })
);
app.use(flash());
// Handlebars setup
app.engine(
    ".hbs",
    engine({
        extname: ".hbs",
        defaultLayout: false,
        helpers: {
            math: function(lvalue, operator, rvalue) {
                lvalue = parseFloat(lvalue);
                rvalue = parseFloat(rvalue);
                return {
                    "+": lvalue + rvalue,
                    "-": lvalue - rvalue,
                    "*": lvalue * rvalue,
                    "/": lvalue / rvalue,
                    "%": lvalue % rvalue,
                }[operator];
            },
        },
    })
);
app.set("view engine", ".hbs");
app.set("views", "./views");

app.locals.success_message = "";
app.locals.error_message = "";
app.locals.admins = "";
app.locals.admin = "";
app.locals.admin_name = "";
app.locals.admin_role = "";

// Register routes
app.use(userRoute);
app.use(bookRoute);

// Catch-all route for 404 errors
app.get("*", (req, res) => {
    res.render("404");
});

// Start server
app.listen(port, () => {
    console.log(`Server is up and running at ${3000}`);
});