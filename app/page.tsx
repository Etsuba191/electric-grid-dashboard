// app/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Dashboard from "@/components/dashboard/DashboardClient"; // Client component

export default async function DashboardPage() {
  const session = await getServerSession(authOptions as any);

  if (!session) {
    redirect("/login");
  }

  const user = (session as any).user as { role?: string };

  if (user?.role === "ADMIN") {
    redirect("/dashboard/admin");
  } else if (user?.role === "USER") {
    redirect("/dashboard/user");
  } else {
    redirect("/select-role");
  }

  return <Dashboard />;
}
