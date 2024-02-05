import { Request, Response } from "express";
import { Contact } from "../../models/Contact/Contact";
import moment from "moment-timezone";

const ContactUs = async (req: Request, res: Response) => {
  // try {
  //     // const data= await CA.find({});
  //     return res.status(200).json({message:"Reading data "});
  // } catch (error) {
  //     console.log(error);
  //     return res.status(500).json({message:"Something went wrong"});
  // }
  try {
    let { name, message, email } = req.body as {
      name: string;
      message: string;
      email: string;
    };
    const { phone } = req.body as { phone: number };
    if (!name || !message || !email) {
      return res.status(400).json({ error: "details missing" });
    }

    name = name?.trim();
    message = message?.trim();
    email = email?.trim().toLowerCase();
    if (name.length > 50 || email.length > 50) {
      return res.status(400).json({ error: "details too long" });
    }
    if (!(email.includes("@") && email.includes("."))) {
      return res.status(400).json({ error: "Invalid email" });
    }
    // const existingContact = await Contact.findOne({ email });
    // if (existingContact) {
    //   return res
    //     .status(400)
    //     .json({ error: "Existing registartion with this email id" });
    // }
    const newContact = new Contact({
      name,
      message,
      email,
      SentAt: moment.tz("Asia/Kolkata").format("DD-MM-YY h:mma"),
    });

    await newContact.save();
    // console.log("Message saved")
    return res.status(200).json({ message: "Message Sent Successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default ContactUs;
