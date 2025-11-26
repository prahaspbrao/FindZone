import { NextResponse } from "next/server";
import prisma from "../../../../lib/db";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();

    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({
        success: false,
        userId: null,
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: {
        id: true,
        email: true,
        usn: true,
        name: true,
      },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        userId: null,
      });
    }

    return NextResponse.json({
      success: true,
      userId: user.id,
      email: user.email,
      usn: user.usn,
      name: user.name,
    });
  } catch (error) {
    console.error("API /me error:", error);
    return NextResponse.json(
      { success: false, userId: null },
      { status: 500 }
    );
  }
}
