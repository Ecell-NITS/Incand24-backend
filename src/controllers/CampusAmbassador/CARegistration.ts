import { Request, Response } from "express";
import { CAreg } from "../../models/CA/CAreg";
import moment from "moment-timezone";

const CARegistration = async (req: Request, res: Response) => {
  // try {
  //     // const data= await CA.find({});
  //     return res.status(200).json({message:"Reading data "});
  // } catch (error) {
  //     console.log(error);
  //     return res.status(500).json({message:"Something went wrong"});
  // }
  try {
    let { name, college, email } = req.body as {
      name: string;
      college: string;
      email: string;
    };
    const { phone } = req.body as { phone: number };
    if (!name || !college || !email || !phone) {
      return res.status(400).json({ error: "details missing" });
    }

    name = name?.trim();
    college = college?.trim();
    email = email?.trim().toLowerCase();
    if (name.length > 50 || college.length > 100 || email.length > 50) {
      return res.status(400).json({ error: "details too long" });
    }
    if (!(email.includes("@") && email.includes("."))) {
      return res.status(400).json({ error: "Invalid email" });
    }
    const existingReg = await CAreg.findOne({ email });
    if (existingReg) {
      return res
        .status(400)
        .json({ error: "Existing registartion with this email id" });
    }
    const newCA = new CAreg({
      name,
      college,
      email,
      phone,
      registeredAt: moment.tz("Asia/Kolkata").format("DD-MM-YY h:mma"),
    });

    await newCA.save();
    // console.log("Message saved")
    return res.status(200).json({ message: "Registration successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Register went wrong" });
  }
};

export default CARegistration;
