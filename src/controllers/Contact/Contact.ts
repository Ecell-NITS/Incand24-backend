import { Request, Response } from "express";
import { Contact } from "../../models/Contact/Contact";
import moment from "moment-timezone";

const ContactUs = async (req: Request, res: Response) => {
  try {
    let { name, message, email, contact } = req.body as {
      name: string;
      message: string;
      email: string;
      contact: string;
    };
    if (!name || !message || !email) {
      return res.status(400).json({ error: "details missing" });
    }

    name = name?.trim();
    message = message?.trim();
    email = email?.trim().toLowerCase();
    contact = contact?.trim();

    if (name.length > 49 || email.length > 49) {
      return res.status(400).json({ error: "details too long" });
    }
    if (!(email.includes("@") && email.includes("."))) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const newContact = new Contact({
      name,
      message,
      email,
      contact,
      SentAt: moment.tz("Asia/Kolkata").format("DD-MM-YY h:mma"),
    });

    await newContact.save();
    return res.status(200).json({ message: "Message Sent Successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default ContactUs;
