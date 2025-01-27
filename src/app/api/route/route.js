import { db } from "../../../lib/firebaseAdmin";

export async function POST(req) {
  const data = await req.json();

  const { uid, type, timestamp, user } = data;
  const { entry_number } = user;

  try {
    // Reference to the 'entries' collection
    const userRef = db.collection("entries");

    // Query to find an existing document with the same entry_number
    const querySnapshot = await userRef
      .where("user.entry_number", "==", entry_number)
      .get();

    console.log("Query snapshot size:", querySnapshot.size);

    // Case 1: New entry_number
    if (querySnapshot.empty) {
      const newEntry = {
        uid,
        type,
        time_out: timestamp,
        user,
      };
      const docRef = await userRef.add(newEntry);
      return new Response(
        JSON.stringify({
          message: "New entry created with time_out",
          id: docRef.id,
        }),
        { status: 200 }
      );
    }

    // Case 2: Existing entry_number
    else {
      const existingDoc = querySnapshot.docs[0];
      const existingData = existingDoc.data();

      // Case 2a: Existing entry_number without time_in
      if (!existingData.time_in) {
        const updatedEntry = {
          ...existingData,
          time_in: timestamp,
        };
        await userRef.doc(existingDoc.id).set(updatedEntry);
        return new Response(
          JSON.stringify({
            message: "Updated existing entry with time_in",
            id: existingDoc.id,
          }),
          { status: 200 }
        );
      }

      // Case 2b: Existing entry_number with time_in (new entry)
      const newEntry = {
        uid,
        type,
        time_out: timestamp,
        user,
      };
      const docRef = await userRef.add(newEntry);
      return new Response(
        JSON.stringify({
          message: "New entry created with time_out",
          id: docRef.id,
        }),
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error saving data:", error);
    return new Response(
      JSON.stringify({ message: "Error saving data", error: error.message }),
      { status: 500 }
    );
  }
}
