import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { confirmationEmailHtml, resetPasswordEmailHtml } from './templatesMailers.js';

dotenv.config();
const { MAILER_HOST, MAILER_PORT, MAILER_USER, MAILER_PASS, APPLICATION_URL } = process.env;


const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    host: MAILER_HOST,
    port: MAILER_PORT,
    secure: false,
    auth: {
      user: MAILER_USER,
      pass: MAILER_PASS
    }
  });

  const mailOptions = {
    from: `"SailingLoc" <${MAILER_USER}>`,
    to,
    subject,
    html
  };

  await transporter.sendMail(mailOptions);
}

export const sendConfirmationEmail = async (username, email, token) => {
  await sendEmail(
    email,
    "Confirmation de votre compte SailingLoc",
    confirmationEmailHtml(username, `${APPLICATION_URL}/confirmation/${token}`)
  );
}

export const sendResetPasswordEmail = async (username, email, token) => {
  await sendEmail(
    email,
    "Réinitialisation de votre mot de passe SailingLoc",
    resetPasswordEmailHtml(username, `${APPLICATION_URL}/reset-password/${token}`)
  );
}


export const sendContactEmail = async (name, email, message, subject) => {
  const transporter = nodemailer.createTransport({
    host: MAILER_HOST,
    port: MAILER_PORT,
    secure: false,
    auth: {
      user: MAILER_USER,
      pass: MAILER_PASS
    }
  });

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: MAILER_USER,
    replyTo: email,
    subject: subject || "Nouveau message de contact",
    text: message
  };

  await transporter.sendMail(mailOptions);
}
