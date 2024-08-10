const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const authMiddleware = require("../middleware/authMiddleware");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const header = fs.readFileSync("./views/includes/header.hbs");
const footer = fs.readFileSync("./views/includes/footer.hbs");

// Configure multer storage
const storage = multer.diskStorage({
  destination: "./public/uploads/uploaded-books", // Destination to store uploaded files
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Initialize multer with file size limit and file filter
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10000000, // Limit file size to 10 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error("Please upload a Image"));
    }
    cb(undefined, true);
  },
}).single("image");

// Route to view all books for the authenticated user
router.get("/books", authMiddleware, async (req, res) => {
  try {
    const items = await Book.find({ user: req.user._id }).lean();

    res.render("book/view_book", {
      header,
      footer,
      items,
    });
  } catch (err) {
    res.send(err);
  }
});

// Route to display the add book form
router.get("/book/add", authMiddleware, async (req, res) => {
  res.render("book/add_book", {
    header,
    footer,
  });
});

// Route to handle adding a new book
router.post("/book/add", authMiddleware, upload, async (req, res) => {
    try {
      const { title, authors, genres, notes, favourite } = req.body;

      // Check if the book already exists
      const existingBook = await Book.findOne({ title });
      if (!existingBook) {
        // Create a new book
        const book = new Book({
          user: req.user._id,
          title,
          authors,
          genres,
          notes,
          isFavourite: favourite === "yes" ? true : false,
          image: req.file.filename,
        });

        await book.save((err) => {
          if (!err) {
            req.flash("success", "Book added successfully!");
            res.redirect("/books");
          } else {
            console.log("Error during Book insertion : " + err);
          }
        });
      } else {
        req.flash("error", "Book already exists");
        res.render("book/add_book", { error_message: req.flash("error") });
      }
    } catch (err) {
      res.status(400).send(err);
    }
  },
  (error, req, res, next) => {
    req.flash("error", "Error while adding book");
    res.render("book/view_book", { error_message: req.flash("error") });
  }
);

// Route to display the edit form for a specific book
router.get("/book/edit/:id", authMiddleware, async (req, res) => {
  try {
    const item = await Book.findById(req.params.id).lean();
    if (item) {
      res.render("book/edit_book", {
        item,
        header,
        footer,
      });
    }
  } catch (err) {
    res.send(err);
  }
});

// Route to handle updating a book
router.post("/book/edit/:id", authMiddleware, upload, async (req, res) => {
  try {
    const { title, authors, genres, notes, favourite } = req.body;
    const updateObj = {
      user: req.user._id,
      title,
      authors,
      genres,
      notes,
      isFavourite: favourite === "yes" ? true : false,
    };

    await Book.findOneAndUpdate({ _id: req.params.id }, updateObj);
    return res.redirect("/books");
  } catch (err) {
    res.status(400).send(err);
  }
});

// Route to delete a book
router.get("/book/delete/:id", authMiddleware, async (req, res) => {
  try {
    await Book.findByIdAndRemove(req.params.id, (err, doc) => {
      if (!err) {
        res.redirect("/books");
      } else {
        res.send("Error in item delete :" + err);
      }
    });
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
