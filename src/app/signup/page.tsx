"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: "Signup failed" }));
      setError(data.error ?? "Signup failed");
      return;
    }

    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-6 text-zinc-100">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h1 className="text-xl font-semibold">Create account</h1>

        <label className="block text-sm">
          <span className="mb-1 block text-zinc-400">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 outline-none focus:border-indigo-500"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-zinc-400">Password (min 8 chars)</span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 outline-none focus:border-indigo-500"
          />
        </label>

        {error && <p className="text-sm text-rose-400">{error}</p>}

        <button type="submit" className="w-full rounded-lg bg-indigo-600 px-3 py-2 font-semibold text-white">
          Sign up
        </button>

        <p className="text-sm text-zinc-400">
          Already have an account? <Link href="/login" className="text-indigo-400">Login</Link>
        </p>
      </form>
    </div>
  );
}
