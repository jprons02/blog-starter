"use client";

import { useState } from "react";
import { useModal } from "@/app/hooks/useModal";
import { motion, AnimatePresence } from "framer-motion";
import {
  validateName,
  validateEmail,
  validatePhone,
} from "@/lib/validationSchemas";
import { getEligibilityResults } from "@/lib/benefitEligibility";
import { ChevronUp, ChevronDown } from "lucide-react";

const steps = [
  "Household",
  "Income",
  "Situations",
  "Housing",
  "Contact",
  "Results",
];

export default function BenefitEligibilityForm() {
  const { closeModal } = useModal();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    householdSize: 1,
    income: "",
    situations: [] as string[],
    housing: "yes",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const handleNext = () => {
    const errors: Record<string, string> = {};

    if (step === 0 && form.householdSize < 1) {
      errors.householdSize = "Household size must be at least 1.";
    }

    if (step === 1 && !form.income) {
      errors.income = "Please select your income range.";
    }

    if (step === 2 && form.situations.length === 0) {
      errors.situations = "Please select at least one option.";
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
      const { situations } = prev;

      // Handle "None of these apply to me" exclusively
      if (value === "None of these apply to me") {
        return {
          ...prev,
          situations: situations.includes(value) ? [] : [value],
        };
      }

      const withoutNone = situations.filter(
        (s) => s !== "None of these apply to me"
      );
      const exists = withoutNone.includes(value);
      return {
        ...prev,
        situations: exists
          ? withoutNone.filter((s) => s !== value)
          : [...withoutNone, value],
      };
    });
  };

  const validateContact = () => {
    const newErrors: Record<string, string> = {};
    const firstNameError = validateName(form.firstName);
    const lastNameError = validateName(form.lastName);
    const emailError = validateEmail(form.email);
    const phoneError = validatePhone(form.phone);

    if (firstNameError) newErrors.firstName = firstNameError;
    if (lastNameError) newErrors.lastName = lastNameError;
    if (emailError) newErrors.email = emailError;
    if (phoneError) newErrors.phone = phoneError;

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
                value={form.householdSize}
                onChange={(e) =>
                  setForm({ ...form, householdSize: Number(e.target.value) })
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
                      householdSize: Math.max(1, prev.householdSize + 1),
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
                      householdSize: Math.max(1, prev.householdSize - 1),
                    }))
                  }
                  className="hover:text-[var(--color-primary)]"
                  aria-label="Decrease"
                >
                  <ChevronDown size={30} />
                </button>
              </div>
            </div>
            {errors.householdSize && (
              <p className="tw-input-error-label">{errors.householdSize}</p>
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
                    checked={form.income === value}
                    onChange={() => setForm({ ...form, income: value })}
                    className="hidden"
                  />
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                      form.income === value
                        ? "border-[var(--color-primary)]"
                        : "border-[var(--color-border)]"
                    }`}
                  >
                    {form.income === value && (
                      <div className="w-3 h-3 rounded-full bg-[var(--color-primary)]" />
                    )}
                  </div>
                  <span className="text-lg text-[var(--color-foreground)]">
                    {label}
                  </span>
                </label>
              ))}
              {errors.income && (
                <p
                  className="tw-input-error-label"
                  style={{ marginTop: "10px" }}
                >
                  {errors.income}
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
                const isChecked = form.situations.includes(label);
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
              {errors.situations && (
                <p
                  className="tw-input-error-label"
                  style={{ marginTop: "10px" }}
                >
                  {errors.situations}
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
                  setForm({ ...form, housing: "yes" });
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
                  setForm({ ...form, housing: "no" });
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
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                className={`tw-input-base ${
                  errors.firstName ? "tw-input-error" : ""
                }`}
              />
              {errors.firstName && (
                <p className="tw-input-error-label">{errors.firstName}</p>
              )}
              <input
                type="text"
                placeholder="Last Name"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className={`tw-input-base ${
                  errors.lastName ? "tw-input-error" : ""
                }`}
              />
              {errors.lastName && (
                <p className="tw-input-error-label">{errors.lastName}</p>
              )}
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`tw-input-base ${
                  errors.email ? "tw-input-error" : ""
                }`}
              />
              {errors.email && (
                <p className="tw-input-error-label">{errors.email}</p>
              )}
              <input
                type="tel"
                placeholder="Phone Number (no dashes or spaces)"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={`tw-input-base ${
                  errors.phone ? "tw-input-error" : ""
                }`}
              />
              {errors.phone && (
                <p className="tw-input-error-label">{errors.phone}</p>
              )}
              <button
                onClick={() => {
                  if (validateContact()) handleNext();
                }}
                className="tw-form-submit-base bg-[var(--color-primary)] text-white w-full mt-2"
              >
                <span className="text-lg color-[var(--color-foreground)]">
                  See My Results
                </span>
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
