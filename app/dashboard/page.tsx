import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
    return null;
  }
  const user = session.user as any;
  const role = user?.role?.toLowerCase();
  if (role === "super-admin") {
    redirect("/dashboard/super-admin");
    return null;
  } else if (role === "admin") {
    redirect("/dashboard/admin");
    return null;
  } else if (role === "user") {
    redirect("/dashboard/user");
    return null;
  } else {
    redirect("/login");
    return null;
  }
}
