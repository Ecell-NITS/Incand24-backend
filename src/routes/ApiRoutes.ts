import express, { Request, Response } from "express";
import home from "../controllers/Home";
import { dashboard } from "../controllers/LocalAuth/Dashboard";
import { AuthRequest } from "../utils/types/AuthRequest";
import { signup } from "../controllers/LocalAuth/Signup";
import { login } from "../controllers/LocalAuth/Login";
import { editProfile } from "../controllers/LocalAuth/EditProfile";
import { sendEmailVerificationLink } from "../controllers/LocalAuth/magiclink/verifyemail/sendEmailVerifyLink";
import { verifyEmail } from "../controllers/LocalAuth/magiclink/verifyemail/VerifyEmail";
import { sendResetPwdLink } from "../controllers/LocalAuth/magiclink/forgotpassword/sendresetpasswordlink";
import { resetPwd } from "../controllers/LocalAuth/magiclink/forgotpassword/Resetpassword";
import { toggle2fa } from "../controllers/LocalAuth/2fa/toggle2fa";
import { verify2faOtp } from "../controllers/LocalAuth/2fa/verify2faotp";
import { registerEvent } from "../controllers/EventsRegistration/Register";
import { sendInvite } from "../controllers/EventsRegistration/Invite/sendInvite";
import { verifyInvite } from "../controllers/EventsRegistration/Invite/verifyInvite";
import { fetchRegisteredEvents } from "../controllers/fetchRegisteredEvents/TeamLeader";
import { fetchAllAccounts } from "../controllers/superadmin/FetchAllAccounts";
import { elevateToAdmin } from "../controllers/superadmin/ElevateToAdmin";
import { demoteRole } from "../controllers/superadmin/DemoteToClient";
import { getEventsForAdmin } from "../controllers/fetchRegisteredEvents/admin/getEventSpecificReg";
import { addEventNameToAdmin } from "../controllers/superadmin/addEventNameToAdmin";
import CARegistration from "../controllers/CampusAmbassador/CARegistration";
import ContactUs from "../controllers/Contact/Contact";
import { fetchCaRegistrations } from "../controllers/CampusAmbassador/FetchCAregs";
import { fetchContact } from "../controllers/Contact/FetchContact";
import PromRegistration from "../controllers/PromRegistration/PromReg";
import { fetchPromRegistrations } from "../controllers/PromRegistration/fetchPromRegistrations";

const router = express.Router();

router.get("/", home);

router.post("/signup", signup);
router.post("/login", login);

// dashboard
const dashboardReqHandler = (req: Request, res: Response) => {
  dashboard(req as AuthRequest, res);
};
router.get("/dashboard", dashboardReqHandler);

// edit profile
const EditProfileHandler = (req: Request, res: Response) => {
  editProfile(req as AuthRequest, res);
};
router.put("/editprofile", EditProfileHandler);

// verify email
const SendEmailVerificationLinkeHandler = (req: Request, res: Response) => {
  sendEmailVerificationLink(req as AuthRequest, res);
};
router.post("/sendverificationlink", SendEmailVerificationLinkeHandler);
router.put("/verifyemail", verifyEmail);

// reset password
router.post("/sendresetpwdlink", sendResetPwdLink);
router.put("/resetpwd", resetPwd);

// toggle 2fa
const twoFaHandler = (req: Request, res: Response) => {
  toggle2fa(req as AuthRequest, res);
};
router.put("/toggle2fa", twoFaHandler);

//2fa
router.post("/verify2faotp", verify2faOtp);
export default router;

// event registration
const EventRegistrationHandler = (req: Request, res: Response) => {
  registerEvent(req as AuthRequest, res);
};
router.post("/registerevent", EventRegistrationHandler);

// send invite link to join team
const SendInviteHandler = (req: Request, res: Response) => {
  sendInvite(req as AuthRequest, res);
};
router.post("/sendinvite", SendInviteHandler);

// verify invite link
router.post("/verifyinvitelink", verifyInvite);

// fetch registered events
const FetchRegisteredEventsHandler = (req: Request, res: Response) => {
  fetchRegisteredEvents(req as AuthRequest, res);
};
router.get("/getregisteredevents", FetchRegisteredEventsHandler);

// get all accounts
const GetAllAccountsHandler = (req: Request, res: Response) => {
  fetchAllAccounts(req as AuthRequest, res);
};
router.get("/getallaccounts", GetAllAccountsHandler);

// elevate to admin
const PromoteRoleHandler = (req: Request, res: Response) => {
  elevateToAdmin(req as AuthRequest, res);
};
router.put("/elevaterole", PromoteRoleHandler);

// demote to client
const DemoteRoleHandler = (req: Request, res: Response) => {
  demoteRole(req as AuthRequest, res);
};
router.put("/demoterole", DemoteRoleHandler);

// add eventName to the admin by superadmin only
const addEventNamesToAdmin = (req: Request, res: Response) => {
  addEventNameToAdmin(req as AuthRequest, res);
};
router.put("/addeventname", addEventNamesToAdmin);

// get event specific registration for the admins only
const getEventSpecificRegistration = (req: Request, res: Response) => {
  getEventsForAdmin(req as AuthRequest, res);
};
router.get("/getalleventsforadmin", getEventSpecificRegistration);

//Campus Ambassador register route
router.post("/CAregister", CARegistration);

const getCaRegs = (req: Request, res: Response) => {
  fetchCaRegistrations(req as AuthRequest, res);
};

//Contact Us route

router.post("/contact", ContactUs);

const getContact = (req: Request, res: Response) => {
  fetchContact(req as AuthRequest, res);
};
router.get("/fetchcontact", getContact);

router.get("/fetchcaregs", getCaRegs);

// prom registration route
router.post("/registration/prom", PromRegistration);

const getPromRegs = (req: Request, res: Response) => {
  fetchPromRegistrations(req as AuthRequest, res);
};

router.get("/fetchpromregs", getPromRegs);
