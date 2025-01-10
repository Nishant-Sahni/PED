export async function POST(req) {
  const data = {
    type: "regular",
    timestamp: Date.now(),
    user: {
      entry_number: "2023csb1379",
      name: "Shreshth Test new",
      email: "2023csb1379@iitrpr.ac.in",
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
