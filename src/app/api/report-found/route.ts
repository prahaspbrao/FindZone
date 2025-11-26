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

    // Create found item using logged-in user's ID
    await prisma.item.create({
      data: {
        name,
        description,
        type: "FOUND",
        userId: loggedInUserId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Found item reported successfully!",
    });
  } catch (error) {
    console.error("REPORT FOUND ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
