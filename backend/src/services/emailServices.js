// src/services/emailService.js

import nodemailer from "nodemailer";

// ================================
// Create SMTP Transport
// ================================
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ================================
// Verify SMTP Connection
// ================================
(async () => {
  try {
    await transporter.verify();
    console.log("✅ SMTP Server Connected Successfully");
  } catch (error) {
    console.error("❌ SMTP Connection Failed");
    console.error(error);
  }
})();

// ================================
// Send Email
// ================================
export async function sendMail({
  to,
  subject,
  html,
  attachment,
}) {
  try {
    console.log("========== SMTP DEBUG ==========");
    console.log("SMTP_HOST :", process.env.SMTP_HOST);
    console.log("SMTP_PORT :", process.env.SMTP_PORT);
    console.log("SMTP_USER :", process.env.SMTP_USER);
    console.log("EMAIL_FROM:", process.env.EMAIL_FROM);
    console.log("TO         :", to);
    console.log("SUBJECT    :", subject);
    console.log("===============================");

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    };

    if (attachment) {
      mailOptions.attachments = [
        {
          filename: attachment.filename,
          content: attachment.content,
          contentType: "application/pdf",
        },
      ];
    }

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email Sent Successfully");
    console.log("Message ID:", info.messageId);

    return info;
  } catch (error) {
    console.error("========== EMAIL ERROR ==========");
    console.error(error);
    console.error("Message:", error.message);

    throw error;
  }
}