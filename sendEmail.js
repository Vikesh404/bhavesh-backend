const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (to, subject, text) => {
  try {
    const otp = text.match(/\d+/)?.[0];

    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Account Verification</h2>
          <p>Your One-Time Password (OTP) is:</p>
          <h1 style="letter-spacing: 3px;">${otp}</h1>
          <p>This OTP will expire in <b>5 minutes</b>.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `
    });

    console.log("📧 Resend email sent:", response.id);
    return true;

  } catch (err) {
    console.error("❌ Resend email error:", err);
    return false;
  }
};
