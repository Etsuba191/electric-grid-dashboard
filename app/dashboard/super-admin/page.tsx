import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SuperAdminDashboard() {
  const session = await getServerSession(authOptions as any);
  const user = (session as any).user;
  if (!session || user?.role?.toLowerCase() !== "super-admin") {
    redirect("/login");
  }
  // Render super-admin dashboard UI here
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
      <p>Welcome, {user?.email}</p>
    </div>
  );
}
