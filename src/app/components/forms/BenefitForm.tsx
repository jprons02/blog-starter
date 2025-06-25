"use client";

import { useState } from "react";
import { useModal } from "@/app/hooks/useModal";
import { motion, AnimatePresence } from "framer-motion";
import {
  validateName,
  validateEmail,
  validatePhone,
} from "@/lib/utils/validationSchemas";
import { getEligibilityResults } from "@/lib/services/benefitEligibility";
import { ChevronUp, ChevronDown } from "lucide-react";
import type { BenefitForm } from "@/lib/types/benefit";
import sendMailchimpLead from "@/lib/api/sendMailchimpLead";
import { toast } from "sonner";

const steps = [
  "Household",
  "Income",
  "Situations",
  "Pay Utility",
  "Contact",
  "Results",
];

export default function BenefitEligibilityForm() {
  const { closeModal } = useModal();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  /*
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  */
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const [form, setForm] = useState<BenefitForm>({
    FNAME: "",
    LNAME: "",
    EMAIL: "",
    PHONE: "",
    HSHLDSIZE: 1,
    INCOME: "",
    FACTORS: [] as string[],
    PAYSUTILS: "yes",
  });

  const handleNext = () => {
    const errors: Record<string, string> = {};

    if (step === 0 && form.HSHLDSIZE < 1) {
      errors.HSHLDSIZE = "Household size must be at least 1.";
    }

    if (step === 1 && !form.INCOME) {
      errors.INCOME = "Please select your income range.";
    }

    if (step === 2 && form.FACTORS.length === 0) {
      errors.FACTORS = "Please select at least one option.";
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    setErrors({});
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 0));

  const toggleSituation = (value: string) => {
    setForm((prev) => {
      const { FACTORS } = prev;

      // Handle "None of these apply to me" exclusively
      if (value === "None of these apply to me") {
        return {
          ...prev,
          FACTORS: FACTORS.includes(value) ? [] : [value],
        };
      }

      const withoutNone = FACTORS.filter(
        (s) => s !== "None of these apply to me"
      );
      const exists = withoutNone.includes(value);
      return {
        ...prev,
        FACTORS: exists
          ? withoutNone.filter((s) => s !== value)
          : [...withoutNone, value],
      };
    });
  };

  const handleSubmit = async () => {
    if (validateContact()) {
      setStatus("sending");
      try {
        const res = await sendMailchimpLead(form);
        const data = await res.json(); // 👈 parse response body

        if (res.ok) {
          setStatus("sent");
          handleNext();
        } else {
          console.log("Mailchimp error:", data.error);
          setStatus("error");
          toast.error(
            data.error.detail || "Something went wrong. Please try again."
          );
        }
      } catch (err) {
        console.log("Submission failed:", err);
        setStatus("error");
        toast.error("Submission failed. Please try again.");
      }
    }
  };

  const validateContact = () => {
    const newErrors: Record<string, string> = {};
    const FNAMEError = validateName(form.FNAME);
    const LNAMEError = validateName(form.LNAME);
    const EMAILError = validateEmail(form.EMAIL);
    const PHONEError = validatePhone(form.PHONE);

    if (FNAMEError) newErrors.FNAME = FNAMEError;
    if (LNAMEError) newErrors.LNAME = LNAMEError;
    if (EMAILError) newErrors.EMAIL = EMAILError;
    if (PHONEError) newErrors.PHONE = PHONEError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <label
              className="block font-medium"
              style={{ color: "var(--color-muted-text)" }}
            >
              How many people are in your household?
            </label>

            <div className="relative w-[100px]">
              <input
                type="number"
                readOnly
                min={1}
                value={form.HSHLDSIZE}
                onChange={(e) =>
                  setForm({ ...form, HSHLDSIZE: Number(e.target.value) })
                }
                className="tw-input-base pr-8" // add right padding for the buttons
                style={{
                  height: "70px",
                  fontSize: "24px",
                  color: "var(--color-foreground)",
                }}
              />
              <div className="absolute right-1 top-1 bottom-1 flex flex-col justify-between">
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      HSHLDSIZE: Math.max(1, prev.HSHLDSIZE + 1),
                    }))
                  }
                  className="hover:text-[var(--color-primary)]"
                  aria-label="Increase"
                >
                  <ChevronUp size={30} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      HSHLDSIZE: Math.max(1, prev.HSHLDSIZE - 1),
                    }))
                  }
                  className="hover:text-[var(--color-primary)]"
                  aria-label="Decrease"
                >
                  <ChevronDown size={30} />
                </button>
              </div>
            </div>
            {errors.HSHLDSIZE && (
              <p className="tw-input-error-label">{errors.HSHLDSIZE}</p>
            )}
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <label
              className="block font-medium"
              style={{ color: "var(--color-muted-text)" }}
            >
              What is your total <strong>monthly</strong> household income?
            </label>
            <div className="space-y-2">
              {[
                { label: "Less than $1,000", value: "<1000" },
                { label: "$1,000 – $1,999", value: "1000-1999" },
                { label: "$2,000 – $2,999", value: "2000-2999" },
                { label: "$3,000 – $3,999", value: "3000-3999" },
                { label: "$4,000 – $4,999", value: "4000-4999" },
                { label: "$5,000 or more", value: "5000+" },
              ].map(({ label, value }) => (
                <label
                  key={value}
                  className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-md hover:bg-[var(--color-hover-bg)] transition"
                >
                  <input
                    type="radio"
                    name="income"
                    value={value}
                    checked={form.INCOME === value}
                    onChange={() => setForm({ ...form, INCOME: value })}
                    className="hidden"
                  />
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                      form.INCOME === value
                        ? "border-[var(--color-primary)]"
                        : "border-[var(--color-border)]"
                    }`}
                  >
                    {form.INCOME === value && (
                      <div className="w-3 h-3 rounded-full bg-[var(--color-primary)]" />
                    )}
                  </div>
                  <span className="text-lg text-[var(--color-foreground)]">
                    {label}
                  </span>
                </label>
              ))}
              {errors.INCOME && (
                <p
                  className="tw-input-error-label"
                  style={{ marginTop: "10px" }}
                >
                  {errors.INCOME}
                </p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <label
              className="block font-medium"
              style={{ color: "var(--color-muted-text)" }}
            >
              Select any that apply:
            </label>
            <div className="space-y-2">
              {[
                "I am pregnant",
                "I have children under 5",
                "I am over age 65",
                "I have a disability",
                "I’m currently unemployed",
                "I receive SNAP, Medicaid, or SSI",
                "None of these apply to me",
              ].map((label) => {
                const isChecked = form.FACTORS.includes(label);
                return (
                  <label
                    key={label}
                    className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-md hover:bg-[var(--color-hover-bg)] transition"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleSituation(label)}
                      className="hidden"
                    />
                    <div
                      className={`w-6 h-6 border-2 rounded-sm flex items-center justify-center transition ${
                        isChecked
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                          : "border-[var(--color-border)]"
                      }`}
                    >
                      {isChecked && (
                        <svg
                          className="w-5 h-5"
                          style={{ color: "var(--color-background)" }}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 5.292a1 1 0 010 1.416l-7.416 7.416a1 1 0 01-1.416 0L3.296 9.416a1 1 0 011.416-1.416l3.96 3.96 6.708-6.708a1 1 0 011.416 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-lg text-[var(--color-foreground)]">
                      {label}
                    </span>
                  </label>
                );
              })}
              {errors.FACTORS && (
                <p
                  className="tw-input-error-label"
                  style={{ marginTop: "10px" }}
                >
                  {errors.FACTORS}
                </p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <label
              className="block font-medium"
              style={{ color: "var(--color-muted-text)" }}
            >
              Do you currently pay rent or utility bills?
            </label>
            <div className="flex space-x-4">
              <button
                className="tw-form-submit-base"
                onClick={() => {
                  setForm({ ...form, PAYSUTILS: "yes" });
                  handleNext();
                }}
                type="button"
              >
                <span className="text-lg color-[var(--color-foreground)]">
                  Yes
                </span>
              </button>
              <button
                className="tw-form-submit-base color-[var(--color-foreground)]"
                onClick={() => {
                  setForm({ ...form, PAYSUTILS: "no" });
                  handleNext();
                }}
                type="button"
              >
                <span className="text-lg color-[var(--color-foreground)]">
                  No
                </span>
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <label
              className="block font-medium"
              style={{ color: "var(--color-muted-text)" }}
            >
              Your Contact Information
            </label>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="First Name"
                value={form.FNAME}
                onChange={(e) => setForm({ ...form, FNAME: e.target.value })}
                className={`tw-input-base ${
                  errors.FNAME ? "tw-input-error" : ""
                }`}
              />
              {errors.FNAME && (
                <p className="tw-input-error-label">{errors.FNAME}</p>
              )}
              <input
                type="text"
                placeholder="Last Name"
                value={form.LNAME}
                onChange={(e) => setForm({ ...form, LNAME: e.target.value })}
                className={`tw-input-base ${
                  errors.LNAME ? "tw-input-error" : ""
                }`}
              />
              {errors.LNAME && (
                <p className="tw-input-error-label">{errors.LNAME}</p>
              )}
              <input
                type="email"
                placeholder="Email"
                value={form.EMAIL}
                onChange={(e) => setForm({ ...form, EMAIL: e.target.value })}
                className={`tw-input-base ${
                  errors.EMAIL ? "tw-input-error" : ""
                }`}
              />
              {errors.EMAIL && (
                <p className="tw-input-error-label">{errors.EMAIL}</p>
              )}
              <input
                type="tel"
                placeholder="Phone Number (no dashes or spaces)"
                value={form.PHONE}
                onChange={(e) => setForm({ ...form, PHONE: e.target.value })}
                className={`tw-input-base ${
                  errors.PHONE ? "tw-input-error" : ""
                }`}
              />
              {errors.PHONE && (
                <p className="tw-input-error-label">{errors.PHONE}</p>
              )}
              <button
                onClick={handleSubmit}
                disabled={status === "sending"}
                className="tw-form-submit-base bg-[var(--color-primary)] text-white w-full mt-2"
              >
                {status === "sending" ? (
                  <div
                    className="w-5 h-5 border-2 border-t-transparent border-[var(--color-primary)] rounded-full animate-spin"
                    style={{ margin: "auto" }}
                  />
                ) : (
                  <span className="text-lg color-[var(--color-foreground)]">
                    See My Results
                  </span>
                )}
              </button>
            </div>
          </div>
        );
      case 5:
        const results = getEligibilityResults(form);
        return (
          <div className="space-y-4 text-[var(--color-muted-text)]">
            <p className="text-base font-medium">
              Based on your answers, you may qualify for:
            </p>

            {results.length > 0 ? (
              <ul className="list-disc pl-5 space-y-3">
                {results.map((benefit) => (
                  <li key={benefit.name}>
                    <strong>{benefit.name}</strong> – {benefit.description}{" "}
                    <a
                      href={benefit.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-[var(--color-primary)]"
                    >
                      Learn more ↗
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm italic">
                Unfortunately, we couldn&apos;t match you with any major federal
                programs based on your answers. But don&apos;t worry — you may
                still be eligible for local or state-level assistance. We
                recommend contacting your county human services office or
                visiting{" "}
                <a
                  href="https://www.benefits.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-[var(--color-primary)]"
                >
                  Benefits.gov ↗
                </a>{" "}
                to explore additional programs.
              </p>
            )}

            <p className="text-sm pt-4">
              * This is a basic estimate. Final eligibility depends on your
              state and submitted documents.
            </p>

            <button
              onClick={closeModal}
              className="tw-form-submit-base bg-[var(--color-primary)] text-white mt-4"
            >
              Close
            </button>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-xs" style={{ color: "var(--color-muted-text)" }}>
        {step < steps.length - 1 ? (
          <>
            Step {step + 1} of {steps.length - 1}:{" "}
            <strong>{steps[step]}</strong>
          </>
        ) : (
          <strong>Results</strong>
        )}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
        >
          {renderStepContent()}

          {step < steps.length - 2 && step !== 3 && (
            <div className="flex justify-between pt-4">
              {step > 0 ? (
                <button
                  onClick={handleBack}
                  className="tw-form-submit-base"
                  style={{ marginRight: "5px" }}
                >
                  Back
                </button>
              ) : (
                <span />
              )}
              <button
                onClick={handleNext}
                className="tw-form-submit-base"
                style={{ marginLeft: "5px" }}
              >
                Next
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
