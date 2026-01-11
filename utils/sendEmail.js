const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

module.exports = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"BhaveshRao" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    });
    return true;
  } catch (err) {
    console.error("❌ Email error:", err.message);
    return false;
  }
};
