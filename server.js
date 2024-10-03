const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT ? process.env.PORT : "3000";
// checks if we are running in dev or production
const MONGODB_URI = process.env.MONGODB_URI;
///////////////////////////
// Connect to DB
///////////////////////////
const connectToDB = async () => {
  try {
    mongoose.connect(MONGODB_URI);
    mongoose.connection.on("connected", () => {
      console.log(`Connected to MongoDB ${mongoose.connection.name}`);
    });
  } catch (err) {
    console.error("Unable to connect to the db", err);
  }
};
connectToDB();

///////////////////////////
// Middleware
///////////////////////////
app.use(cors());
app.use(express.json());
// app.use(morgan())

///////////////////////////
// Routers
///////////////////////////
const regularRouter = require("./routes/regular");
const featuredRouter = require("./routes/featured");
const certificationRouter = require("./routes/certifications");
///////////////////////////
// Routes
///////////////////////////
app.use("/featured", featuredRouter);
app.use("/regular", regularRouter);
app.use("/certifications", certificationRouter);
// console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
