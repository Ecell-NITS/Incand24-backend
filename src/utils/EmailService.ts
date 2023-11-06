import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL as string,
    pass: process.env.PASSWORD as string,
  },
});

export const sendEmail = (to: string, subject: string, text: string) => {
  const mailOptions = {
    from: process.env.EMAIL as string,
    to,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Email successfully send", info.response);
    }
  });
};
