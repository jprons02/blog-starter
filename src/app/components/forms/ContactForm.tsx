"use client";

import { useState } from "react";
import { toast } from "sonner";
import sendEmail from "@/lib/api/sendEmail";
import verifyCaptcha from "@/lib/api/verifyRecaptcha";
import { useModal } from "@/app/hooks/useModal";
import { validateName, validateEmail } from "@/lib/utils/validationSchemas";

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

export default function ContactForm() {
  const { closeModal } = useModal();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameError = validateName(form.name);
    const emailError = validateEmail(form.email);
    const messageError = form.message.trim() ? "" : "Message is required";

    const fieldErrors: Record<string, string> = {};
    if (nameError) fieldErrors.name = nameError;
    if (emailError) fieldErrors.email = emailError;
    if (messageError) fieldErrors.message = messageError;

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
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
        closeModal();
      } else {
        throw new Error("Failed to send");
      }
    } catch {
      setStatus("error");
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <input
          name="name"
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
          className={`tw-input-base ${errors.name ? "tw-input-error" : ""}`}
        />
        {errors.name && <p className="tw-input-error-label">{errors.name}</p>}
      </div>

      <div className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Your email"
          value={form.email}
          onChange={handleChange}
          className={`tw-input-base ${errors.email ? "tw-input-error" : ""}`}
        />
        {errors.email && <p className="tw-input-error-label">{errors.email}</p>}
      </div>

      <div className="space-y-4">
        <textarea
          name="message"
          placeholder="Your message"
          value={form.message}
          onChange={handleChange}
          className={`tw-input-base ${errors.message ? "tw-input-error" : ""}`}
        />
        {errors.message && (
          <p className="tw-input-error-label" style={{ marginTop: "-17px" }}>
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="tw-form-submit-base flex items-center justify-center gap-2"
      >
        {status === "sending" ? (
          <div className="w-5 h-5 border-2 border-t-transparent border-[var(--color-primary)] rounded-full animate-spin" />
        ) : (
          "Send Message"
        )}
      </button>
    </form>
  );
}
