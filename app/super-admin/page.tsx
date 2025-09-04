import { redirect } from "next/navigation";
export default function RemovedSuperAdmin() {
  redirect("/login");
}
