const axios = require("axios");

async function sendEmail(to, subject, text) {
  try {
    const apiKey = process.env.BREVO_API_KEY;

    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { email: "noreply@bhaveshrao.online", name: "BhaveshRao" },
        to: [{ email: to }],
        subject,
        textContent: text,
      },
      {
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("OTP Email Sent →", to);
  } catch (err) {
    console.log("Brevo Error:", err.message);
  }
}

module.exports = sendEmail;
