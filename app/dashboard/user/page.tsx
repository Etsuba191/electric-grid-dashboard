import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default async function UserDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const role = session.user?.role?.toLowerCase();
  if (role === "admin") redirect("/dashboard/admin");
  return <DashboardClient userEmail={session.user?.email || ""} userRole="user" />;
}
