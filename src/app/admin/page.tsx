"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // 2FA state
  const [requires2FA, setRequires2FA] = useState(false);
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const [totpCode, setTotpCode] = useState(["", "", "", "", "", ""]);
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [backupCode, setBackupCode] = useState("");
  
  const totpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const { data: session, status } = useSession();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (status === 'loading') return;
    if (session?.user) {
      router.push('/admin/dashboard');
    }
  }, [session, status, router]);

  const handleVerify2FA = useCallback(async () => {
    setError("");
    setLoading(true);

    const code = useBackupCode ? backupCode : totpCode.join("");

    try {
      const verifyResponse = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pendingToken,
          code,
          isBackupCode: useBackupCode,
        }),
      });

      const data = await verifyResponse.json();

      if (!verifyResponse.ok) {
        setError(data.error || "Neplatný kód");
        setTotpCode(["", "", "", "", "", ""]);
        totpRefs.current[0]?.focus();
        setLoading(false);
        return;
      }

      // 2FA úspěšné - dokončíme přihlášení
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.ok) {
        router.push("/admin/dashboard");
      } else {
        setError("Nastala chyba při přihlašování");
      }
    } catch (err) {
      setError("Nastala chyba při ověřování");
      console.error('2FA verify error:', err);
    } finally {
      setLoading(false);
    }
  }, [useBackupCode, backupCode, totpCode, pendingToken, email, password, router]);

  // Auto-submit when all TOTP digits are entered
  useEffect(() => {
    if (requires2FA && !useBackupCode && totpCode.every(d => d !== "")) {
      handleVerify2FA();
    }
  }, [requires2FA, useBackupCode, totpCode, handleVerify2FA]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await loginResponse.json();

      if (!loginResponse.ok) {
        setError(data.error || "Nesprávný email nebo heslo");
        setLoading(false);
        return;
      }

      // Pokud vyžaduje 2FA
      if (data.requires2FA) {
        setRequires2FA(true);
        setPendingToken(data.pendingToken);
        setLoading(false);
        // Focus první TOTP pole
        setTimeout(() => totpRefs.current[0]?.focus(), 100);
        return;
      }

      // Bez 2FA - pokračujeme s NextAuth
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
    } catch (err) {
      setError("Nastala chyba při přihlašování");
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleTotpChange(index: number, value: string) {
    if (value.length > 1) {
      // Pokud uživatel vložil více znaků (paste), rozdělíme je
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newCode = [...totpCode];
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newCode[index + i] = digit;
        }
      });
      setTotpCode(newCode);
      const nextIndex = Math.min(index + digits.length, 5);
      totpRefs.current[nextIndex]?.focus();
      return;
    }

    if (/^\d*$/.test(value)) {
      const newCode = [...totpCode];
      newCode[index] = value;
      setTotpCode(newCode);
      
      if (value && index < 5) {
        totpRefs.current[index + 1]?.focus();
      }
    }
  }

  function handleTotpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !totpCode[index] && index > 0) {
      totpRefs.current[index - 1]?.focus();
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-400 via-fuchsia-300 to-pink-400 dark:from-zinc-900 dark:via-indigo-900 dark:to-zinc-800">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-400/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl" />
      
      <AnimatePresence mode="wait">
        {!requires2FA ? (
          <motion.form
            key="login-form"
            onSubmit={handleSubmit}
            className="relative z-10 bg-white/90 dark:bg-zinc-900/90 shadow-2xl rounded-2xl p-10 w-full max-w-sm space-y-7 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-col items-center gap-2 mb-2">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-pink-400 shadow-lg mb-2">
                <svg width="36" height="36" fill="none" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="18" fill="#fff" fillOpacity=".2"/>
                  <path d="M18 8c-3.866 0-7 3.134-7 7 0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4 0-3.866-3.134-7-7-7Zm0 2c2.757 0 5 2.243 5 5 0 1.104-.896 2-2 2h-6c-1.104 0-2-.896-2-2 0-2.757 2.243-5 5-5Zm-6 13c-2.21 0-4 1.79-4 4v1c0 1.104.896 2 2 2h16c1.104 0 2-.896 2-2v-1c0-2.21-1.79-4-4-4H12Zm-2 5v-1c0-1.104.896-2 2-2h12c1.104 0 2 .896 2 2v1H10Z" fill="#2563eb"/>
                </svg>
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
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Heslo"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary text-base text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400"
              required
              disabled={loading}
            />
            {error && <motion.div className="text-red-500 text-sm text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{error}</motion.div>}
            <button 
              type="submit" 
              className="w-full py-2 rounded-lg bg-white/95 text-zinc-900 font-semibold text-lg shadow border border-zinc-200 hover:bg-zinc-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Přihlašování...
                </span>
              ) : 'Přihlásit se'}
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="2fa-form"
            className="relative z-10 bg-white/90 dark:bg-zinc-900/90 shadow-2xl rounded-2xl p-10 w-full max-w-sm space-y-6 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-col items-center gap-2 mb-4">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-500 shadow-lg mb-2">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <h1 className="text-2xl font-bold text-center tracking-tight text-zinc-900 dark:text-white">Dvoufaktorové ověření</h1>
              <p className="text-sm text-zinc-500 text-center">
                {useBackupCode ? 'Zadejte záložní kód' : 'Zadejte kód z autentikační aplikace'}
              </p>
            </div>

            {useBackupCode ? (
              <input
                type="text"
                placeholder="Záložní kód"
                value={backupCode}
                onChange={e => setBackupCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary text-base text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 font-mono text-center tracking-wider"
                disabled={loading}
                autoFocus
              />
            ) : (
              <div className="flex justify-center gap-2">
                {totpCode.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { totpRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleTotpChange(index, e.target.value)}
                    onKeyDown={e => handleTotpKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary text-zinc-900 dark:text-white"
                    disabled={loading}
                  />
                ))}
              </div>
            )}

            {error && <motion.div className="text-red-500 text-sm text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{error}</motion.div>}

            <button 
              type="button"
              onClick={handleVerify2FA}
              className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold text-lg shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || (!useBackupCode && totpCode.some(d => d === "")) || (useBackupCode && !backupCode)}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Ověřuji...
                </span>
              ) : 'Ověřit'}
            </button>

            <div className="flex justify-between text-sm">
              <button
                type="button"
                onClick={() => {
                  setUseBackupCode(!useBackupCode);
                  setError("");
                  setTotpCode(["", "", "", "", "", ""]);
                  setBackupCode("");
                }}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {useBackupCode ? 'Použít autentikační aplikaci' : 'Použít záložní kód'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setRequires2FA(false);
                  setPendingToken(null);
                  setTotpCode(["", "", "", "", "", ""]);
                  setBackupCode("");
                  setError("");
                }}
                className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
              >
                Zpět
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
