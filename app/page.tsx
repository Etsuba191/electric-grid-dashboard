// app/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Dashboard from "@/components/dashboard/DashboardClient"; // Client component

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = session.user;
  const role = user?.role?.toLowerCase();

  if (role === "admin") {
    redirect("/dashboard/admin");
  } else if (role === "user") {
    redirect("/dashboard/user");
  } else {
    redirect("/login");
  }

  return null; // This page only redirects
}