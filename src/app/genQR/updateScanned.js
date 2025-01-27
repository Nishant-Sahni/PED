import { ref, update, database } from "../../lib/firebaseClient";


const markQRCodeAsScanned = async () => {
  try {
    await update(ref(database, "qr_codes/current"), {
      scanned: true,
    });
    console.log("QR code marked as scanned.");
  } catch (error) {
    console.error("Error marking QR code as scanned:", error);
  }
};

export default markQRCodeAsScanned;
