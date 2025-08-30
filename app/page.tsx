

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions as any);
  if (!session) {
    redirect("/login");
    return null;
  }
  const user = (session as any).user as { role?: string };
  if (user?.role === "ADMIN") {
    redirect("/dashboard/admin");
    return null;
  } else if (user?.role === "USER") {
    redirect("/dashboard/user");
    return null;
  } else {
    redirect("/select-role");
    return null;
  }
}