import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import RoleSelector from "@/components/RoleSelector";
import { redirect } from "next/navigation";

export default async function SelectRolePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  // If user already has a role, redirect to dashboard
  const user = session.user as { email?: string; role?: string };
  if (user?.role === "ADMIN") redirect("/dashboard/admin");
  if (user?.role === "USER") redirect("/dashboard/user");
  return <RoleSelector userEmail={user.email || ""} />;
}
