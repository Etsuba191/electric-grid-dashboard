import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!email || !password || !role) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // Save as hash.js and run: node hash.js
const bcrypt = require('bcryptjs');
bcrypt.hash('yourpassword', 12).then(console.log);
      // Always set role to USER, ignore any frontend value
    // Create user in database
      const user = await prisma.user.create({
        data: { name, email: email.toLowerCase(), passwordHash, role: 'USER' },
        select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json({ message: "User created", userId: user.id }, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
