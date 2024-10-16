const nodemailer = require("nodemailer");
const postContactFormSubmission = async (req, res) => {
  const { subject, message, email, name, affiliation, connection } = req.body;
  try {
    if ((!subject, !message, !name, !email)) {
      return res
        .status(400)
        .json({
          error: `Missing a requireed field to send contact email to ${process.env.ADMIN_EMAIL}`,
        });
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASS,
      },
    });

    const mailOptions = {
      from: "cassius.reynolds.dev@gmail.com",
      to: "cassius.reynolds.dev@gmail.com",
      subject: subject,
      text: `Message from ${name}. \n\n ${message}\n\nCompany / Affiliation: ${affiliation}\n\nRole/Connection: ${connection}\n\nEmail:${email}`,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: `Email sent successfully` });
  } catch (err) {
    res.status(500).json({
      error: "Unable to send email to cassius.reynolds.dev@gmail.com",
    });
  }
};

module.exports = {
  postContactFormSubmission,
};
