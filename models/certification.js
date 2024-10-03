const mongoose = require("mongoose");

const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String },
  link: { type: String },
});

const Certification = mongoose.model("certification", certificationSchema);

module.exports = Certification;
