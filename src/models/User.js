const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
  },
  { timestamps: true }
);

// MIddleware to generate a JWT for user authentication
userSchema.methods.generateUserAuthToken = async function () {
  try {
    const user = this;

    // Sign a JWT with user ID and a secret key
    const token = jwt.sign(
      { _id: user._id.toString() },
      process.env.TOKEN_SECRET_KEY
    );

    return token;
  } catch (error) {
    console.log(error);
  }
};

// Middleware function to hash the user's password before saving to the DB
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = new mongoose.model("User", userSchema);

module.exports = User;
