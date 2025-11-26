import { NextResponse } from "next/server";
import prisma from "../../../../lib/db";
import { cookies } from "next/headers";

function convertDobToISO(dob: string) {
  const parts = dob.split("-");
  if (parts.length !== 3) return dob;
  const [dd, mm, yyyy] = parts;
  return `${yyyy}-${mm}-${dd}`;
}

export async function POST(request: Request) {
  try {
    const { usn, dob } = await request.json();

    if (!usn || !dob) {
      return NextResponse.json({ message: "Missing USN or DOB" }, { status: 400 });
    }

    const dobIso = convertDobToISO(dob);

    const user = await prisma.user.findFirst({
      where: {
        usn: usn.toUpperCase(),
        dob: dobIso,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "Invalid USN or DOB" }, { status: 401 });
    }

    // ⭐ SET COOKIES HERE — THE MOST IMPORTANT PART ⭐
    const cookieStore = cookies();

    (await cookieStore).set("userId", String(user.id), {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "lax",
    });

    (await cookieStore).set("email", user.email, {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "lax",
    });

    (await cookieStore).set("usn", user.usn, {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.json({
      success: true,
      message: "Login successful",
      userId: user.id,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
