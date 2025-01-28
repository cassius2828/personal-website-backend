const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
  },
  twoFactorSecret: {
    type: String,
  },
});

userSchema.set("toObject", {
  transform: (doc, ret) => {
    delete ret.password; // deletes the password
    return ret; // then just returns the document
  },
});

module.exports = mongoose.model("User", userSchema);
