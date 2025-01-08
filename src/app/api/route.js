import app from "@/lib/firebaseAdmin";

export async function GET() {
  return Response.json({ message: 'Hello World!' })
}