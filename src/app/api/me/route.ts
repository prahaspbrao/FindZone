import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value ?? null;
  const email = (await cookieStore).get("email")?.value ?? null;

  return Response.json({ userId, email });
}
