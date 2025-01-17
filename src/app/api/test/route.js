export async function POST(req) {
  const data = {
    uid: "1234567890987654321",
    type: "regular",
    timestamp: 1737276107,
    user: {
      entry_number: "2023CSB1108",
      name: "Ayush tyagi",
      email: "2023csb1108@iitrpr.ac.in",
    },
  };

  const response = await fetch("http://localhost:3000/api/route", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  return new Response(JSON.stringify(result), { status: 200 });
}
