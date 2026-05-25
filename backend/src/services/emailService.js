const nodemailer = require("nodemailer");

/**
 * Reusable utility service to send HTML formatted emails using SMTP settings.
 *
 * @param {Object} options - Configuration details for the email
 * @param {string} options.email - Recipient email address
 * @param {string} options.subject - Subject line of the email
 * @param {string} options.html - HTML body content
 */
const sendEmail = async (options) => {
  // Initialize SMTP transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Mail payload options
  const mailOptions = {
    from: `"AI Code Reviewer" <${process.env.SMTP_USER || "aicodelens@gmail.com"}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  // Dispatch email transport
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
