import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const currentUserRole = session?.user?.role?.toLowerCase();

  // Only admin or super_admin can change roles
  if (!session || (currentUserRole !== "admin" && currentUserRole !== "super_admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { role, email } = await req.json();
  if (!role || !email) return NextResponse.json({ error: "Missing data" }, { status: 400 });

  // Prevent changing to super_admin unless current user is super_admin
  if (role === "SUPER_ADMIN" && currentUserRole !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized to set super_admin role" }, { status: 403 });
  }

  // Update user role in DB
  await prisma.user.update({ where: { email }, data: { role } });
  return NextResponse.json({ ok: true });
}
