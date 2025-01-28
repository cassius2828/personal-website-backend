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
});

userSchema.set("toObject", {
  transform: (doc, ret) => {
    delete ret.password; // deletes the password
    return ret; // then just returns the document
  },
});

// Pre-save middleware to set displayedName to username if not provided
userSchema.pre("save", async function (next) {

//   // Hash password if it's new or modified
//   if (this.isModified("password")) {
//     this.password = bcrypt.hashSync(this.password, 10);
//   }
//   next();
});

module.exports = mongoose.model("User", userSchema);
