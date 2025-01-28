const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function login(req, res) {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await UserModel.findOne({ username });

    // Check if user exists and if the password is correct
    if (user && bcrypt.compareSync(password, user.password)) {
      // Generate a JWT token with the user data
      const token = jwt.sign({ user }, process.env.JWT_SECRET);

      // Respond with the generated token
      res.status(200).json({ token });
    } else {
      // Respond with an error if credentials are invalid
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    // Handle any errors and respond with a 400 status code
    res.status(400).json({ error: err.message });
  }
}

async function register(req, res) {
  let { username, password, email } = req.body;
  console.log(req.body);
  try {
    // Check if the username or email already exists
    const foundByUsername = await UserModel.findOne({ username });
    if (foundByUsername) {
      return res.status(400).json({ error: "Username already taken." });
    }
    const foundByEmail = await UserModel.findOne({ email });
    if (foundByEmail) {
      return res.status(400).json({ error: "Email already taken." });
    }

    // Hash the password
    password = bcrypt.hashSync(password, 10);

    // Create a new user in the database
    const createdUser = await UserModel.create({
      username,
      email,
      password,
    });

    // Generate a JWT token with the created user data
    const token = jwt.sign({ user: createdUser }, process.env.JWT_SECRET);

    // Respond with the generated token
    res.status(201).json({ token });
  } catch (err) {
    console.log(err);

    // Handle any other errors and respond with a 400 status code
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  register,
  login,
};
