export const runtime = "nodejs";   // ⭐ REQUIRED FOR NODEMAILER ⭐

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { randomInt } from 'crypto';
import prisma from '../../../../lib/db';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const loggedInUserId = Number(cookieStore.get("userId")?.value);
    const loggedInEmail = cookieStore.get("email")?.value;

    if (!loggedInUserId || !loggedInEmail) {
      return NextResponse.json(
        { success: false, message: "Unauthorized user" },
        { status: 401 }
      );
    }

    const { itemId } = await req.json();

    if (!itemId) {
      return NextResponse.json(
        { success: false, message: "Item ID is required." },
        { status: 400 }
      );
    }

    // Fetch item with creator info
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

    // ❌ BLOCK CREATOR from requesting OTP
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

    // Store OTP in DB (recommended)
    await prisma.otp.create({
  data: {
    email: loggedInEmail,
    code: otpCode,
    expiresAt,
    used: false,
    itemId: Number(itemId),
  },
});


    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: `"Lost & Found System" <${process.env.EMAIL_USER}>`,
      to: loggedInEmail,  // ⭐ OTP goes to the user who clicked verify
      subject: 'OTP Verification for Item Return',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 10px;">
          <h2>OTP Verification</h2>
          <p>Hello User,</p>
          <p>You requested to verify the return of item #${itemId}.</p>
          <p><strong>Your OTP is:
          <span style="color: #2e86de;">${otp}</span></strong></p>
          <p>This OTP is valid for 5 minutes.</p>
          <br />
          <p>Thank you,<br />Lost & Found Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: "OTP sent to your email.",
      email: loggedInEmail
    });

  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send OTP." },
      { status: 500 }
    );
  }
}
