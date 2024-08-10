const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const fs = require("fs");
const Item = require("../models/Book");
const header = fs.readFileSync("./views/includes/header.hbs");
const footer = fs.readFileSync("./views/includes/footer.hbs");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const path = require("path");

// Route to render the homepage with books data
router.get("/", async (req, res) => {
  try {
    const booksData = fs.readFileSync(
      path.join(__dirname, "../seeder/books.json")
    ).toString();
    const booksJson = JSON.parse(booksData);

    res.render("home", {
      books: booksJson.image,
    });
  } catch (err) {
    res.send(err);
  }
});

// Render registration form
router.get("/register", (req, res) => {
  res.render("register");
});

// Handle user registration
router.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password, confirm_password } = req.body;
    const checkEmail = await User.find({ email }).countDocuments();

    if (checkEmail === 0) {
      if (password === confirm_password) {
        const user = new User({
          firstname,
          lastname,
          email,
          password,
        });

        // save data
        await user.save();

        req.flash("success", "User registration is successfully completed!");
        res.status(201).render("login", {
          success_message: req.flash("success"),
        });
      } else {
        req.flash("error", "Password does not Match!");
        res.render("register", {
          error_message: req.flash("error"),
        });
      }
    } else {
      req.flash("error", "Email ID Already exists!");
      res.render("register", {
        error_message: req.flash("error"),
      });
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

// Render login form
router.get("/login", (req, res) => {
  res.render("login");
});

// Handle user login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    let isMatch;
    if (password && user) {
      isMatch = await bcrypt.compare(password, user?.password);
    }
    if (isMatch) {
      const token = await user.generateUserAuthToken();
      res.cookie("user", token, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        httpOnly: true,
      });

      res.redirect("/home");
    } else {
      req.flash("error", "Email or Password Invalid");
      res.render("login", {
        error_message: req.flash("error"),
      });
    }
  } catch (err) {
    console.log(err);
    req.flash("error", "Email or Password Invalid");
    res.render("login", {
      error_message: req.flash("error"),
    });
  }
});

// Handle user dashboard
router.get("/home", authMiddleware, (req, res) => {
  res.render("user/dashboard", { header, footer });
});

// Display list of users
router.get("/users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find().lean();
    if (users.length) {
      res.render("user/view_users", {
        header,
        footer,
        users,
      });
    } else {
      res.send("Error in retrieving admin list :" + err);
    }
  } catch (err) {
    res.send(err);
  }
});

// Start Google authentication processuth
router.get("/auth/google",passport.authenticate("google", { scope: ["profile", "email"] }));

// Handle Google authentication callback
router.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const token = jwt.sign(
      { _id: req.user._id.toString() },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "1d" }
    );

    // Set token as a cookie
    res.cookie("user", token, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
      httpOnly: true,
    });

    // Successful authentication, redirect to home.
    res.redirect("/home");
  }
);

// Handle user logout
router.get("/logout", (req, res) => {
  res.clearCookie("user", {
    httpOnly: true,
  });

  res.redirect("/");
});

module.exports = router;
