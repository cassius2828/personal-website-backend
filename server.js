const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const session = require("express-session");

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
// Initialize session
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(cors());
app.use(express.json());
// app.use(morgan())

///////////////////////////
// Routers
///////////////////////////
const authRouter = require("./routes/auth");
const projectsRouter = require("./routes/projects");
const contactRouter = require("./routes/contact");
const blogsRouter = require("./routes/blogs");
const certificationRouter = require("./routes/certifications");
///////////////////////////
// Routes
///////////////////////////

app.use("/auth", authRouter);
app.use("/projects", projectsRouter);
app.use("/certifications", certificationRouter);
app.use("/blogs", blogsRouter);
app.use("/contact", contactRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
