import { NextResponse } from "next/server";
import prisma from "../../../../lib/db";
import nodemailer from "nodemailer";
import { randomInt } from "crypto";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();

    const loggedInUserId = Number(cookieStore.get("userId")?.value);

    if (!loggedInUserId) {
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

    // ⭐ Fetch item AND OWNER email
    const item = await prisma.item.findUnique({
      where: { id: Number(itemId) },
      select: {
        userId: true,
        user: {
          select: { email: true }
        }
      }
    });

    if (!item) {
      return NextResponse.json(
        { success: false, message: "Item not found" },
        { status: 404 }
      );
    }

    // ❌ Block creator from verifying own item
    if (item.userId === loggedInUserId) {
      return NextResponse.json(
        { success: false, message: "You cannot verify your own item." },
        { status: 403 }
      );
    }

    // ⭐ Email of the person who posted the item
    const ownerEmail = item.user.email;

    // Generate OTP
    const otp = randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Save OTP for ITEM OWNER (not requester)
    await prisma.otp.create({
      data: {
        email: ownerEmail,
        code: otp,
        expiresAt,
        used: false,
        itemId: Number(itemId),
      },
    });

    // Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"FindZone" <${process.env.EMAIL_USER}>`,
      to: ownerEmail,        // ⭐ Send to item owner
      subject: "OTP to verify your item",
      html: `
        <h2>OTP for Item #${itemId}</h2>
        <h1 style="color: #4F46E5">${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    });

    return NextResponse.json({
      success: true,
      email: ownerEmail,     // ⭐ Return owner's email
      message: "OTP sent to item owner",
    });

  } catch (error) {
    console.error("SEND OTP ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
