const mongoose = require("mongoose");
const BookSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    authors: {
      type: String,
      required: true,
    },
    genres: {
      type: String,
      required: true,
    },
    notes: {
      type: Array,
      required: true,
    },
    isFavourite: {
      type: Boolean,
      required: false,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Book = new mongoose.model("Book", BookSchema);

module.exports = Book;
