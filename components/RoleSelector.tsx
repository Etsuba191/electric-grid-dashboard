"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RoleSelector({ userEmail }: { userEmail: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSelect = async (role: "ADMIN" | "USER") => {
    setLoading(true);
    const res = await fetch("/api/set-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, email: userEmail }),
    });
    setLoading(false);
    if (res.ok) {
      if (role === "ADMIN") router.replace("/dashboard/admin");
      else router.replace("/dashboard/user");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Select Your Role</h1>
      <div className="flex gap-8">
        <button
          className="px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
          onClick={() => handleSelect("ADMIN")}
          disabled={loading}
        >
          Admin
        </button>
        <button
          className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          onClick={() => handleSelect("USER")}
          disabled={loading}
        >
          User
        </button>
      </div>
    </div>
  );
}
