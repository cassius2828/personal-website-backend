const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || "3000";
// checks if we are running in dev or production
const MONGODB_URI = process.env.MONGODB_URI;
///////////////////////////
// Connect to DB
///////////////////////////

mongoose.connect(MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`connected to db ${mongoose.connection.name}`);
});

///////////////////////////
// Middleware
///////////////////////////
app.use(cors());
app.use(express.json());
// app.use(morgan())

///////////////////////////
// Routers
///////////////////////////
const projectsRouter = require("./routes/projects");
const certificationRouter = require("./routes/certifications");
///////////////////////////
// Routes
///////////////////////////

app.use("/projects", projectsRouter);
app.use("/certifications", certificationRouter);
// console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
