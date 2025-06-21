"use client";

declare global {
  interface Window {
    grecaptcha: {
      execute: (
        siteKey: string,
        options: { action: string }
      ) => Promise<string>;
    };
  }
}

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import sendEmail from "@/lib/sendEmail";
import verifyCaptcha from "@/lib/verifyRecaptcha";
import { useContactModal } from "@/app/hooks/useContactModal";

export default function ContactModal() {
  const { isOpen, setIsOpen } = useContactModal();
  const backdropRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      setIsOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const token = await window.grecaptcha.execute(recaptchaKey, {
        action: "submit",
      });

      const verified = await verifyCaptcha(token);
      if (!verified) {
        setStatus("error");
        toast.error("Failed reCAPTCHA verification.");
        return;
      }

      const res = await sendEmail(form);

      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", message: "" });
        toast.success("Message sent successfully!");
        setIsOpen(false);
      } else {
        throw new Error("Failed to send");
      }
    } catch {
      setStatus("error");
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={backdropRef}
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.3 }}
            className="relative bg-[var(--color-card-bg)] text-[var(--color-card-text)] rounded-2xl shadow-xl max-w-md w-full p-6"
          >
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-[var(--color-muted-text)] hover:text-[var(--color-foreground)] text-lg"
              aria-label="Close contact form"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4 font-heading">Contact</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[var(--color-border)] bg-transparent px-4 py-2 text-sm placeholder-[var(--color-muted-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
              <input
                name="email"
                type="email"
                placeholder="Your email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[var(--color-border)] bg-transparent px-4 py-2 text-sm placeholder-[var(--color-muted-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
              <textarea
                name="message"
                placeholder="Your message"
                value={form.message}
                onChange={handleChange}
                required
                className="w-full h-28 resize-none rounded-lg border border-[var(--color-border)] bg-transparent px-4 py-2 text-sm placeholder-[var(--color-muted-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full py-2 rounded-lg bg-[var(--color-primary)] text-black font-semibold hover:brightness-110 transition disabled:opacity-50"
              >
                {status === "sending" ? "Sending..." : "Send Message"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/*
  // Handle form submit event
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      // Step 1: Get a reCAPTCHA token from Google
      const token = await window.grecaptcha.execute(recaptchaKey, {
        action: "submit",
      });

      // Step 2: Validate token via backend Lambda
      const verified = await verifyCaptcha(token);

      if (!verified) {
        setStatus("error");
        toast.error("Failed reCAPTCHA verification.");
        return;
      }

      // Step 3: Send the email through SES Lambda
      const res = await sendEmail(form);

      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", message: "" }); // Reset form
        toast.success("Message sent successfully!");
        setIsOpen(false); // Close modal
      } else {
        throw new Error("Failed to send");
      }
    } catch (err) {
      setStatus("error");
      toast.error("Something went wrong. Please try again.");
    }
  };

*/
