import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { role, email } = await req.json();
  if (!role || !email) return NextResponse.json({ error: "Missing data" }, { status: 400 });
  if (role !== "ADMIN" && role !== "USER") return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  // Update user role in DB
  await prisma.user.update({ where: { email }, data: { role } });
  return NextResponse.json({ ok: true });
}
