import { Request, Response, Router as router } from "express";
import { CAreg } from "../../models/CA/CAreg";
const CARegistration = async (req: Request, res: Response) => {
  // try {
  //     // const data= await CA.find({});
  //     return res.status(200).json({message:"Reading data "});
  // } catch (error) {
  //     console.log(error);
  //     return res.status(500).json({message:"Something went wrong"});
  // }
  try {
    const { name, college, email, phone } = req.body;
    const newCA = new CAreg({ name, college, email, phone });
    await newCA.save();
    // console.log("Message saved")
    return res.status(200).json({ message: "Registration successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Register went wrong" });
  }
};

export default CARegistration;
