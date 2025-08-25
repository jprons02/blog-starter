// /app/locations/_locationsCtx.tsx
"use client";

import { createContext, useContext } from "react";
import { benefitsFocusMap, type FocusSlug } from "@/lib/utils/benefitsFocusMap";

/* ---------------- Types ---------------- */
export type QAString = readonly [string, string];
export type QARichHtml = { html: string } | { qHtml: string; aHtml: string };
export type QAItem = QAString | QARichHtml;

export type LegacyResource = {
  applyUrl?: string;
  countyUrl?: string;
  stateUrl?: string;
  infoUrl?: string;
  faqs?: readonly QAItem[] | readonly QAString[];
  [k: string]: unknown;
};

export type LocalResource = {
  link?: string;
  phone?: string;
  email?: string;
  contact?: string;
  faqs?: readonly QAItem[];
  [k: string]: unknown;
};

export type LocationData = {
  city: string;
  state: string;
  county?: string;
  resources: Record<string, LegacyResource>;
  faqByTopic?: Record<string, readonly QAItem[]>;
  localResources?: Record<string, LocalResource>;
};

const Ctx = createContext<LocationData | null>(null);

export function LocationProvider({
  value,
  children,
}: {
  value: LocationData;
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLocation() {
  return useContext(Ctx);
}

/* -------------- tokens -------------- */
export function City({ fallback = "your city" }: { fallback?: string }) {
  const v = useLocation();
  return <>{v?.city ?? fallback}</>;
}
export function State({ fallback = "your state" }: { fallback?: string }) {
  const v = useLocation();
  return <>{v?.state ?? fallback}</>;
}

/* -------------- labels / fallbacks -------------- */
const LABEL_ALIAS: Record<string, FocusSlug | string> = {
  snap: "snap",
  wic: "wic",
  liheap: "housing",
  medicaid: "medicaid",
  ccdf: "childcare",
  safelink: "safelink",
  ssdi: "ssdi",
  ssi: "ssi",
  housing: "housing",
};

function defaultLabelFor(name: string) {
  const key = LABEL_ALIAS[name] as FocusSlug | undefined;
  return key
    ? benefitsFocusMap[key]?.label ?? name.toUpperCase()
    : name.toUpperCase();
}

function genericApplyUrl(name: string): string | undefined {
  const key = LABEL_ALIAS[name] as FocusSlug | undefined;
  const obj = key ? benefitsFocusMap[key] : undefined;
  return obj?.apply || obj?.learnMore;
}

/* -------------- utils -------------- */
function isHttpUrl(href: string) {
  return /^https?:\/\//i.test(href);
}
function isPhoneLike(value: string) {
  return /^[\d\-\+\.\(\)\s]{7,}$/.test(value);
}
function isEmailLike(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
function getStringField(
  obj: Record<string, unknown> | undefined,
  key: string
): string | null {
  if (!obj) return null;
  const v = obj[key];
  return typeof v === "string" ? v : null;
}

/* -------------- FAQ guards / normalization -------------- */
function isTupleQA(x: unknown): x is QAString {
  return (
    Array.isArray(x) &&
    x.length === 2 &&
    typeof x[0] === "string" &&
    typeof x[1] === "string"
  );
}
function isHtmlPair(x: unknown): x is { qHtml: string; aHtml: string } {
  if (!isRecord(x)) return false;
  const q = x["qHtml"];
  const a = x["aHtml"];
  return typeof q === "string" && typeof a === "string";
}
function isHtmlBlock(x: unknown): x is { html: string } {
  if (!isRecord(x)) return false;
  const h = x["html"];
  return typeof h === "string";
}

function normalizeFaqs(faqs: unknown): readonly QAItem[] | null {
  if (!Array.isArray(faqs)) return null;
  const filtered = faqs.filter(
    (item) => isTupleQA(item) || isHtmlPair(item) || isHtmlBlock(item)
  ) as QAItem[];
  return filtered.length ? filtered : null;
}

/* -------------- ResourceLink -------------- */
export function ResourceLink({
  name,
  field,
  children,
  fallbackUrl,
  className,
}: {
  name: string;
  field?: string;
  children?: React.ReactNode;
  fallbackUrl?: string;
  className?: string;
}) {
  const v = useLocation();
  const city = v?.city ?? "";
  const state = v?.state ?? "";
  const tokenize = (s: string) =>
    s.replaceAll("<City/>", city).replaceAll("<State/>", state);

  const lr: LocalResource | undefined = v?.localResources?.[name];
  const rs: LegacyResource | undefined = v?.resources?.[name];

  // FAQs
  if (field === "faqs") {
    const faqs = normalizeFaqs(lr?.faqs) || normalizeFaqs(rs?.faqs);
    if (!faqs?.length) return null;

    return (
      <div className={className ?? "space-y-4"}>
        {faqs.map((item, i) => {
          if (isTupleQA(item)) {
            const [q, a] = item;
            return (
              <div key={i}>
                <p className="font-semibold">{tokenize(q)}</p>
                <p>{tokenize(a)}</p>
              </div>
            );
          }
          if (isHtmlPair(item)) {
            return (
              <div key={i}>
                <p
                  className="font-semibold"
                  dangerouslySetInnerHTML={{ __html: tokenize(item.qHtml) }}
                />
                <div
                  dangerouslySetInnerHTML={{ __html: tokenize(item.aHtml) }}
                />
              </div>
            );
          }
          if (isHtmlBlock(item)) {
            return (
              <div
                key={i}
                dangerouslySetInnerHTML={{ __html: tokenize(item.html) }}
              />
            );
          }
          return null;
        })}
      </div>
    );
  }

  // specific field
  if (field && field !== "faqs") {
    const fromLr = getStringField(
      lr as Record<string, unknown> | undefined,
      field
    );
    const fromRs = getStringField(rs, field);
    const raw = fromLr ?? fromRs;
    if (!raw) return null;

    const href =
      isPhoneLike(raw) || field.toLowerCase().includes("phone")
        ? `tel:${raw.replace(/[^\d\+]/g, "")}`
        : isEmailLike(raw) || field.toLowerCase().includes("email")
        ? `mailto:${raw}`
        : raw;

    const label = children ?? defaultLabelFor(name);
    const isExternal = isHttpUrl(href);
    const targetProps = isExternal
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};
    return (
      <a href={href} {...targetProps} className={className}>
        {label}
      </a>
    );
  }

  // primary CTA
  const primary =
    lr?.link ??
    rs?.applyUrl ??
    rs?.countyUrl ??
    rs?.stateUrl ??
    rs?.infoUrl ??
    fallbackUrl ??
    genericApplyUrl(name) ??
    null;

  if (!primary) return null;

  const href = isPhoneLike(primary)
    ? `tel:${primary.replace(/[^\d\+]/g, "")}`
    : isEmailLike(primary)
    ? `mailto:${primary}`
    : primary;

  const label = children ?? defaultLabelFor(name);
  const isExternal = isHttpUrl(href);
  const targetProps = isExternal
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
  return (
    <a href={href} {...targetProps} className={className}>
      {label}
    </a>
  );
}

/* -------------- visibility helpers -------------- */
export function IfLocation({ children }: { children: React.ReactNode }) {
  return useLocation() ? <>{children}</> : null;
}
export function IfNoLocation({ children }: { children: React.ReactNode }) {
  return useLocation() ? null : <>{children}</>;
}
