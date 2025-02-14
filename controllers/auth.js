const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

const enable2FA = async (req, res) => {
  try {
    // Generate a secret for the user
    const secret = speakeasy.generateSecret({
      name: "Cassius-Portfolio", // This will show in the user's authenticator app
    });

    // Save the secret (base32) in your database for the user
    const userId = req.user.user._id;
    if (!userId) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = await UserModel.findById(userId);
    user.twoFactorSecret = secret.base32;
    await user.save();
    // Generate a QR code for the user to scan
    const qrCodeDataUrl = await qrcode.toDataURL(secret.otpauth_url);

    // Send the secret and QR code to the client
    res.status(201).json({
      message: "2FA enabled. Scan the QR code with your authenticator app.",
      qrCode: qrCodeDataUrl, // Data URL for the QR code image
      secret: secret.base32, // For manual entry if needed
    });
  } catch (err) {
    console.error("Error enabling 2FA:", err);
    console.log(err);
    res.status(500).json({ error: "Failed to enable 2FA" });
  }
};

const verify2FA = async (req, res) => {

  try {
    const { token, userId } = req.body; // The 6-digit code from the user's authenticator app

    // Retrieve the user's secret from the database
    const user = await UserModel.findById(userId);
    const secret = user.twoFactorSecret;

    // Verify the TOTP code
    const verified = speakeasy.totp.verify({
      secret: secret, // Secret from the database
      encoding: "base32",
      token: token, // Code provided by the user
    });

    if (verified) {
      const token = jwt.sign({ user }, process.env.JWT_SECRET);
      res.json({ token });
    } else {
      res.status(401).json({ error: "Invalid 2FA code." });
    }
  } catch (err) {
    console.error("Error verifying 2FA:", err);
    res.status(500).json({ error: "Failed to verify 2FA" });
  }
};

async function register(req, res) {
  let { username, password, email } = req.body;
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
const changePassTemp = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username });
    user.password = bcrypt.hashSync(password, 10);
    await user.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to change password" });
  }
};

async function login(req, res) {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await UserModel.findOne({ username });

    // Check if user exists and if the password is correct
    if (user && bcrypt.compareSync(password, user.password)) {
      // Generate a JWT token with the user data

      if (user.twoFactorSecret) {
        return res.status(200).json({ twoFactorFA: true, userId: user._id });
      } else {
 
        const token = jwt.sign({ user }, process.env.JWT_SECRET);
        return res.status(200).json({ token });
      }

      // Respond with the generated token first token for 2FA Flow
    } else {
      // Respond with an error if credentials are invalid
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    // Handle any errors and respond with a 400 status code
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  register,
  verify2FA,
  enable2FA,
  login,
  changePassTemp,
};
