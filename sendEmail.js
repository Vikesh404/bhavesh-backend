const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// ✅ Verify transporter at startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter verification failed:", error.message);
  } else {
    console.log("✅ Email transporter is ready to send emails");
  }
});

module.exports = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: `"BhaveshRao" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    });

    console.log("📧 Email sent:", info.response);
    return true;

  } catch (err) {
    console.error("❌ Email send error:", err);
    return false;
  }
};
