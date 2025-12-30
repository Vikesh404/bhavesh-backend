const nodemailer = require("nodemailer");

async function sendEmail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"BhaveshRao" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
