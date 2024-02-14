import { Request, Response } from "express";
import { Prom } from "../../models/prom_reg/promReg";
import moment from "moment-timezone";

const PromRegistration = async (req: Request, res: Response) => {
  try {
    let { name, partner, email, payment } = req.body as {
      name: string;
      partner: string;
      email: string;
      payment: string;
    };

    const { phone } = req.body as { phone: number };

    if (!name || !partner || !email || !phone || !payment) {
      return res.status(400).json({ error: "details missing" });
    }

    name = name?.trim();
    partner = partner?.trim();
    payment = payment?.trim();
    email = email?.trim().toLowerCase();

    if (name.length > 49 || partner.length > 49 || email.length > 49) {
      return res.status(400).json({ error: "details too long" });
    }

    if (!(email.includes("@") && email.includes("."))) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const existingReg = await Prom.findOne({ email });

    if (existingReg) {
      return res
        .status(400)
        .json({ error: "Existing registartion with this email id" });
    }
    const newProm = new Prom({
      name,
      partner,
      email,
      phone,
      payment,
      registeredAt: moment.tz("Asia/Kolkata").format("DD-MM-YY h:mma"),
    });

    await newProm.save();
    // console.log("Message saved")
    return res.status(200).json({ message: "Registration successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Register went wrong" });
  }
};

export default PromRegistration;
