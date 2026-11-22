
import "dotenv/config";
import nodemailer from "nodemailer";

const emailEnabled = process.env.EMAIL_ENABLED === "true";

export const mailTransporter = emailEnabled
    ? nodemailer.createTransport({
          host: process.env.SMTP_HOST ?? "smtp.gmail.com",
          port: Number(process.env.SMTP_PORT ?? 465),
          secure: process.env.SMTP_SECURE !== "false",
          auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASSWORD
          },
          connectionTimeout: 10000,
          greetingTimeout: 10000,
          socketTimeout: 20000
      })
    : null;

export async function verifyEmailConnection() {
    if (!mailTransporter) {
        console.log("Email sending is disabled.");
        return false;
    }

    if (
        !process.env.SMTP_USER ||
        !process.env.SMTP_PASSWORD ||
        !process.env.EMAIL_FROM
    ) {
        throw new Error(
            "SMTP_USER, SMTP_PASSWORD and EMAIL_FROM must be configured."
        );
    }

    await mailTransporter.verify();

    console.log("Gmail SMTP connection verified.");
    return true;
}

export async function sendEmail(
    to: string,
    subject: string,
    text: string
) {
    if (!mailTransporter) {
        throw new Error("Email sending is disabled.");
    }

    return mailTransporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        text
    });
}
