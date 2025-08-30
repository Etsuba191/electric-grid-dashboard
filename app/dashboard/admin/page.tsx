import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

import DashboardClient from '@/components/dashboard/DashboardClient';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role?.toLowerCase() !== "admin") {
    redirect("/login");
  }

  const user = session.user as any;
  return <DashboardClient userEmail={user.email || ''} userRole={user.role?.toLowerCase() === 'admin' ? 'admin' : 'user'} />;
}
