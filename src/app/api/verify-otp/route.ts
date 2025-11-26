export const runtime = "nodejs";

import { NextResponse } from "next/server";
import prisma from "../../../../lib/db";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();

    const loggedInUserId = Number((await cookieStore).get("userId")?.value);
    const loggedInEmail = (await cookieStore).get("email")?.value;

    if (!loggedInUserId || !loggedInEmail) {
      return NextResponse.json(
        { success: false, message: "Unauthorized user" },
        { status: 401 }
      );
    }

    const { code, itemId } = await req.json();

    if (!code || !itemId) {
      return NextResponse.json(
        { success: false, message: "Invalid request" },
        { status: 400 }
      );
    }

    // Fetch item
    const item = await prisma.item.findUnique({
      where: { id: Number(itemId) },
      select: { userId: true }
    });

    if (!item) {
      return NextResponse.json(
        { success: false, message: "Item not found" },
        { status: 404 }
      );
    }

    // ❌ BLOCK CREATOR
    if (item.userId === loggedInUserId) {
      return NextResponse.json(
        {
          success: false,
          message: "You cannot verify your own reported item."
        },
        { status: 403 }
      );
    }

    // Validate OTP
    const otpEntry = await prisma.otp.findFirst({
      where: {
        email: loggedInEmail,
        code,
        itemId: Number(itemId),
        used: false,
        expiresAt: { gt: new Date() }
      },
      orderBy: { id: "desc" }
    });

    if (!otpEntry) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Mark OTP as used
    await prisma.otp.update({
      where: { id: otpEntry.id },
      data: { used: true }
    });

    // Mark item as returned
    await prisma.item.update({
      where: { id: Number(itemId) },
      data: { isReturned: true }
    });

    return NextResponse.json({
      success: true,
      message: "Item successfully verified and marked as returned",
    });

  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
