"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      Logout
    </button>
  );
}
