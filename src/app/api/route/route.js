import { db } from "../../../lib/firebaseAdmin";

export async function POST(req) {
  const data = await req.json();
  const { uid, type, timestamp, user } = data;
  const { entry_number } = user;

  try {
    const userRef = db.collection("entries");

    // Query Firestore for documents with the same entry_number
    const querySnapshot = await userRef
      .where("user.entry_number", "==", entry_number)
      .get();

    console.log("Query snapshot size:", querySnapshot.size);

    if (querySnapshot.empty) {
      // Case 1: No previous entry exists, create a new one with time_out
      const newEntry = {
        uid,
        type,
        time_out: timestamp,
        user,
      };
      const docRef = await userRef.add(newEntry);
      console.log("New entry created with time_out:", docRef.id);
      return new Response(
        JSON.stringify({
          message: "New entry created with time_out",
          id: docRef.id,
        }),
        { status: 200 }
      );
    } else {
      // Check if any document has the same entry_number and only time_out (no time_in)
      let foundDoc = null;
      querySnapshot.forEach((doc) => {
        const existingData = doc.data();
        if (existingData.time_out && !existingData.time_in) {
          foundDoc = doc;
        }
      });

      if (foundDoc) {
        // Case 2: Update the existing entry with time_in
        await userRef.doc(foundDoc.id).update({
          time_in: timestamp,
        });
        console.log("Updated existing entry with time_in:", foundDoc.id);
        return new Response(
          JSON.stringify({
            message: "Updated existing entry with time_in",
            id: foundDoc.id,
          }),
          { status: 200 }
        );
      } else {
        // Case 3: No matching document found, create a new entry with time_out
        const newEntry = {
          uid,
          type,
          time_out: timestamp,
          user,
        };
        const docRef = await userRef.add(newEntry);
        console.log("New entry created with time_out:", docRef.id);
        return new Response(
          JSON.stringify({
            message: "New entry created with time_out",
            id: docRef.id,
          }),
          { status: 200 }
        );
      }
    }
  } catch (error) {
    console.error("Error saving data:", error);
    return new Response(
      JSON.stringify({ message: "Error saving data", error: error.message }),
      { status: 500 }
    );
  }
}