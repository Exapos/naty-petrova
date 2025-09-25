"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res?.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Nesprávný email nebo heslo");
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-400 via-fuchsia-300 to-pink-400 dark:from-zinc-900 dark:via-indigo-900 dark:to-zinc-800">
      {/* Decorative blurred circles */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-400/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl" />
      <motion.form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/90 dark:bg-zinc-900/90 shadow-2xl rounded-2xl p-10 w-full max-w-sm space-y-7 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="flex flex-col items-center gap-2 mb-2">
          {/* Logo or icon */}
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-pink-400 shadow-lg mb-2">
            <svg width="36" height="36" fill="none" viewBox="0 0 36 36"><circle cx="18" cy="18" r="18" fill="#fff" fillOpacity=".2"/><path d="M18 8c-3.866 0-7 3.134-7 7 0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4 0-3.866-3.134-7-7-7Zm0 2c2.757 0 5 2.243 5 5 0 1.104-.896 2-2 2h-6c-1.104 0-2-.896-2-2 0-2.757 2.243-5 5-5Zm-6 13c-2.21 0-4 1.79-4 4v1c0 1.104.896 2 2 2h16c1.104 0 2-.896 2-2v-1c0-2.21-1.79-4-4-4H12Zm-2 5v-1c0-1.104.896-2 2-2h12c1.104 0 2 .896 2 2v1H10Z" fill="#2563eb"/></svg>
          </span>
          <h1 className="text-2xl font-bold text-center tracking-tight text-zinc-900 dark:text-white">Admin Login</h1>
        </div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary text-base text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400"
          required
        />
        <input
          type="password"
          placeholder="Heslo"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary text-base text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400"
          required
        />
        {error && <motion.div className="text-red-500 text-sm text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{error}</motion.div>}
  <button type="submit" className="w-full py-2 rounded-lg bg-white/95 text-zinc-900 font-semibold text-lg shadow border border-zinc-200 hover:bg-zinc-100 transition">Přihlásit se</button>
      </motion.form>
    </div>
  );
}
