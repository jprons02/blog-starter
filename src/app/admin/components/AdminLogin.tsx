"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AdminLoginProps {
  onSuccess: () => void;
}

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send code");
        return;
      }

      setMessage("Check your email for a verification code");
      setStep("code");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid code");
        return;
      }

      onSuccess();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Admin Login
          </h1>
          <p className="text-muted-foreground mb-6">
            {step === "email"
              ? "Enter your email to receive a login code"
              : "Enter the code sent to your email"}
          </p>

          <AnimatePresence mode="wait">
            {step === "email" ? (
              <motion.form
                key="email-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSendCode}
              >
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="admin@example.com"
                    required
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-sm mb-4"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sending..." : "Send Code"}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="code-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleVerifyCode}
              >
                {message && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-green-600 text-sm mb-4 p-3 bg-green-50 rounded-lg"
                  >
                    {message}
                  </motion.p>
                )}

                <div className="mb-4">
                  <label
                    htmlFor="code"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Verification Code
                  </label>
                  <input
                    type="text"
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-center text-2xl tracking-widest font-mono"
                    placeholder="000000"
                    maxLength={6}
                    required
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-sm mb-4"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                >
                  {isLoading ? "Verifying..." : "Verify Code"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setCode("");
                    setError("");
                    setMessage("");
                  }}
                  className="w-full text-muted-foreground py-2 text-sm hover:text-foreground transition-colors"
                >
                  Use a different email
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
