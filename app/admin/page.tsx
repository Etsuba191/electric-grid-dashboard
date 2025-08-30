import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const role = (session.user as any)?.role;
  if (role !== "ADMIN") redirect("/dashboard");
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <p className="mt-2 text-gray-600">Restricted admin area.</p>
    </div>
  );
}


