import { redirect } from "next/navigation";
export default function RemovedSuperAdminLegacy() {
  redirect("/login");
}
