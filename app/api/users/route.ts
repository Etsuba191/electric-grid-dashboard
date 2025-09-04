import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { generateRandomPassword, hashPassword } from "@/lib/utils";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role?.toLowerCase();
  if (!session || userRole !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true }
  });
  return NextResponse.json({ users });
}

// POST: Add a new user (admin only)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role?.toLowerCase();
  if (!session || userRole !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { name, email, role } = await req.json();
  if (!name || !email || !role) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  // Check if user already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }
  // Generate and hash a random password
  const randomPassword = generateRandomPassword();
  const passwordHash = await hashPassword(randomPassword);

  const user = await prisma.user.create({
    data: { name, email, role, passwordHash },
  });
  console.log(`New user ${user.email} created with temporary password: ${randomPassword}`);
  return NextResponse.json({ user });
}

// DELETE: Delete a user (admin only)
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role?.toLowerCase();
  if (!session || userRole !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing user id" }, { status: 400 });
  await prisma.user.delete({ where: { id: String(id) } });
  return NextResponse.json({ ok: true });
}

// PATCH: Update a user (admin only)
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role?.toLowerCase();
  if (!session || userRole !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, name, email, role } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing user id" }, { status: 400 });
  const user = await prisma.user.update({
    where: { id: String(id) },
    data: { name, email, role },
  });
  return NextResponse.json({ user });
}
