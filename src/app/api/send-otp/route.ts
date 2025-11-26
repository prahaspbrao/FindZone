export const runtime = "nodejs"; // ⭐ REQUIRED FOR NODEMAILER ⭐

import { NextResponse } from "next/server";
import prisma from "../../../../lib/db";
import nodemailer from "nodemailer";
import { randomInt } from "crypto";
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

    const { itemId } = await req.json();

    if (!itemId) {
      return NextResponse.json(
        { success: false, message: "Item ID is required" },
        { status: 400 }
      );
    }

    // Fetch the item
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
          message: "You cannot request OTP for your own reported item."
        },
        { status: 403 }
      );
    }

    // Generate OTP
    const otp = randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Save OTP in DB
    await prisma.otp.create({
      data: {
        email: loggedInEmail,
        code: otp,
        expiresAt,
        used: false,
        itemId: Number(itemId),
      },
    });

    // Email sender
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"FindZone" <${process.env.EMAIL_USER}>`,
      to: loggedInEmail,
      subject: "OTP Verification Code",
      html: `
        <h2>Your OTP Code</h2>
        <p>The OTP to verify item <strong>#${itemId}</strong> is:</p>
        <h1 style="color:#4F46E5">${otp}</h1>
        <p>This OTP expires in 5 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      email: loggedInEmail,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error("SEND OTP ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
