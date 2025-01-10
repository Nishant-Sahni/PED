import { db } from "../../../lib/firebaseAdmin"; 

export async function POST(req) {
  const data = await req.json();

  // validate the incoming data
  // if (!data.type || !data.timestamp || !data.user || !data.user.email) {
  //   return new Response(JSON.stringify({ message: "Invalid data" }), {
  //     status: 400,
  //   });
  // }

  const { type, timestamp, user } = data;
  const { entry_number } = user;

  try {
    const userRef = db.collection("entries");

    const querySnapshot = await userRef
      .where("user.entry_number", "==", entry_number)
      .get();
    console.log("Query snapshot size:", querySnapshot.size);

    //New entry_number
    if (querySnapshot.empty) {
      const newEntry = {
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
    //existing entry number
    else {
      const existingDoc = querySnapshot.docs[0];
      const existingData = existingDoc.data();

      //existing entry_number but without time_in
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
      //existing entry number but with time_in (new entry)
      else {
        const newEntry = {
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
    }
  } catch (error) {
    console.error("Error saving data:", error);
    return new Response(
      JSON.stringify({ message: "Error saving data", error }),
      { status: 500 }
    );
  }
}