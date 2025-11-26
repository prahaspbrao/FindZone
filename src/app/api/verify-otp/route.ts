import { NextResponse } from "next/server";
import prisma from "../../../../lib/db";

export async function POST(req: Request) {
  try {
    const { code, email, itemId } = await req.json();

    if (!code || !email || !itemId) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    // Find matching OTP
    const otpEntry = await prisma.otp.findFirst({
      where: {
        email,
        code,
        used: false,
        expiresAt: { gt: new Date() },
        itemId: Number(itemId),
      },
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
      data: { used: true },
    });

    // Mark item Returned
    await prisma.item.update({
      where: { id: Number(itemId) },
      data: { isReturned: true },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.log("VERIFY OTP ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
