// app/api/report-lost/route.ts
import { NextResponse } from "next/server";
import prisma from "../../../../lib/db";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();

    const loggedInUserId = Number(cookieStore.get("userId")?.value);
    const loggedInUSN = cookieStore.get("usn")?.value;

    if (!loggedInUserId || !loggedInUSN) {
      return NextResponse.json(
        { error: "Unauthorized user" },
        { status: 401 }
      );
    }

    const { name, description } = await req.json();

    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      );
    }

    // Create lost item using logged-in user's ID
    await prisma.item.create({
      data: {
        name,
        description,
        type: "LOST",
        userId: loggedInUserId, // ⭐ logged-in user only
      },
    });

    return NextResponse.json({
      success: true,
      message: "Lost item reported successfully!",
    });
  } catch (error) {
    console.error("REPORT LOST ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
