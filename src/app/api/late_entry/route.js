import { db } from "../../../lib/firebaseAdmin";
import nodemailer from "nodemailer";

export async function POST(req, res) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "jassi.108.js@gmail.com",
      pass: "mmcj qozu hqka viuw",
    },
  });

  try {
    // Query all entries in the collection
    const snapshot = await db.collection("entries").get();

    if (snapshot.empty) {
      console.log("No entries found in the collection.");
      return res.status(200).json({ message: "No entries found." });
    }

    const lateEntryList = {};

    snapshot.forEach((doc) => {
      const data = doc.data();

      if (data.time_in == null && data.type === "regular") {
        const userEmail = data.user?.email || "unknown";
        const userName = data.user?.name || "Student";
        const userEntryNumber = data.user?.entry_number || "unknown";

        lateEntryList[userEntryNumber] = userName;

        const mailOptions = {
          from: "jassi.108.js@gmail.com",
          to: userEmail,
          subject: "Late Entry Alert",
          text: `Dear ${userName},\n\nYour entry record is incomplete or missing.\n\nPlease adhere to the rules and ensure timely entry in the future.\n\nBest Regards,\nYour Admin Team`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error(`Failed to send email to ${userEmail}:`, err);
          } else {
            console.log(`Email sent to ${userEmail}:`, info.response);
          }
        });
      }
    });

    console.log("Late entry list:", lateEntryList);

    const summaryMailOptions = {
      from: "jassi.108.js@gmail.com",
      to: "joy.shukla0474@gmail.com",
      subject: "Daily Late Entry Summary",
      text: `These are the students with late entry:\n${JSON.stringify(
        lateEntryList,
        null,
        2
      )}`,
    };

    transporter.sendMail(summaryMailOptions, (err, info) => {
      if (err) {
        console.error("Failed to send summary email:", err);
      } else {
        console.log("Summary email sent:", info.response);
      }
    });

    res.status(200).json({ message: "Late entry check completed." });
  } catch (error) {
    console.error("Error processing late entries:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
