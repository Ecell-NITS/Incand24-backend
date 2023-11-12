import { Request, Response } from "express";
import { User } from "../../../models/LocalAuth/User";
import moment from "moment-timezone";

// verify the invite link
// access: public
// POST request
// payload: url (whole url)

export const verifyInvite = async (req: Request, res: Response) => {
  try {
    const { url } = req.body as {
      url: string;
    };

    if (!url) {
      return res.status(400).json({
        error: "url required",
      });
    }

    // trim the inputs
    const URL = url.trim();

    // finding the email of teamleader from the invite link
    let fromEmail: any;
    const startIndex = URL.indexOf("invite/") + "invite/".length;
    const endIndex = URL.indexOf("/", startIndex);

    if (startIndex !== -1 && endIndex !== -1) {
      fromEmail = URL.substring(startIndex, endIndex);
      console.log("Invite sent from", fromEmail);
    } else {
      console.log("something went wrong");
    }

    // finding the email of member from the invite link
    let memberEmail: any;
    const toStartIndex = URL.indexOf("to/") + "to/".length;
    const toEndIndex = URL.indexOf("/token");

    if (toStartIndex !== -1 && toEndIndex !== -1) {
      memberEmail = URL.substring(toStartIndex, toEndIndex);
      console.log("memberEmail:", memberEmail);
    } else {
      console.log("something went wrong");
    }

    // finding the token from the invite link
    let token;
    const tokenStartIndex = url.indexOf("token?/") + "token?/".length;
    const lastSlashIndex = url.lastIndexOf("/");

    if (
      tokenStartIndex !== -1 &&
      lastSlashIndex !== -1 &&
      lastSlashIndex > tokenStartIndex
    ) {
      token = url.substring(tokenStartIndex, lastSlashIndex);
      console.log("Extracted token:", token);
    } else {
      console.log("something went wrong");
    }

    const teamLeader = await User.findOne({ email: fromEmail });
    if (!teamLeader) {
      return res.status(404).json({ error: "Team Leader not found" });
    }

    const teamMember = await User.findOne({ email: memberEmail });
    if (!teamMember) {
      return res.status(404).json({ error: "Team Member not found" });
    }

    // finding the eventName
    let eventNameFromUrl: string;
    const lastSlashIndex0 = URL.lastIndexOf("/");

    if (lastSlashIndex0 !== -1 && lastSlashIndex0 < URL.length - 1) {
      eventNameFromUrl = URL.substring(lastSlashIndex0 + 1);
      console.log("eventNameFromUrl:", eventNameFromUrl);
    } else {
      console.log("something went wrong");
    }

    // check if the token is expired or not
    const currentTime = moment()
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss");

    // inviteLink is an array of objects, fo through each object to filter that object whose leaderEmail is equal to fromEmail and eventname is equal to eventname

    const filteredInvite = teamMember.inviteLink.filter(
      (invite) =>
        invite.leaderEmail === fromEmail &&
        invite.eventName === eventNameFromUrl
    );

    const filtertedArrayOfTeamMembers = teamLeader.registrationInvite.filter(
      (invite) => invite.eventName === eventNameFromUrl
    );

    if (filteredInvite.length > 0) {
      const expiryTime = filteredInvite[0].expiresAt;
      if (!expiryTime) {
        return res.status(400).json({ error: "Invite link expired" });
      }
      if (currentTime > expiryTime) {
        return res.status(400).json({ error: "Invite link expired" });
      } else {
        // check if the token is correct or not
        const uniqueToken = filteredInvite[0].uniqueToken;
        if (!uniqueToken) {
          return res.status(400).json({ error: "Invite link not found" });
        }
        if (uniqueToken !== token) {
          return res.status(400).json({ error: "Invalid token" });
        } else {
          // add the memberEmail to the teamLeader's registrationInvite array
          filtertedArrayOfTeamMembers[0].teamMembers.push(memberEmail);
        }
      }
    } else {
      return res.status(400).json({ error: "Invite link not found" });
    }

    return res.status(200).json({
      message: "Invite link verified",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
