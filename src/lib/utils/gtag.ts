/*
declare global {
  interface Window {
    gtag: (...args: [string, string, Record<string, unknown>?]) => void;
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || "";

// Pageview tracking function
export const pageview = (url: string) => {
  if (!window.gtag || !GA_TRACKING_ID) return;
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
};

// Custom event tracking function
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (!window.gtag || !GA_TRACKING_ID) return;

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
};
*/

// lib/utils/gtag.ts
declare global {
  interface Window {
    gtag: (
      args_0: string,
      args_1: string,
      args_2?: Record<string, unknown>
    ) => void;
  }
}
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || "";

const isReady = () =>
  typeof window !== "undefined" && !!window.gtag && !!GA_TRACKING_ID;

export const pageview = (url: string, title?: string) => {
  if (!isReady()) return;
  window.gtag!("config", GA_TRACKING_ID, {
    page_path: url,
    page_title:
      title ?? (typeof document !== "undefined" ? document.title : undefined),
  });
};

export const trackEvent = (
  eventName: string,
  params: Record<string, unknown> = {}
) => {
  if (!isReady()) return;
  const base = {
    page_path:
      typeof window !== "undefined" ? window.location.pathname : undefined,
    page_title: typeof document !== "undefined" ? document.title : undefined,
  };
  window.gtag!("event", eventName, { ...base, ...params });
};

// ✅ NEW: legacy-compatible wrapper so existing imports keep working
type LegacyEventParams = {
  action: string;
  category?: string;
  label?: string;
} & Record<string, unknown>;

export const event = ({ action, ...params }: LegacyEventParams) =>
  trackEvent(action, params);

export const withUtm = (
  rawUrl: string,
  utm: Record<string, string | undefined>
) => {
  try {
    const u = new URL(rawUrl);
    Object.entries(utm).forEach(([k, v]) => v && u.searchParams.set(k, v));
    return u.toString();
  } catch {
    return rawUrl;
  }
};

// Convenience wrappers
export const programClick = (p: {
  program: string;
  link_url: string;
  city?: string;
  state?: string;
  position?: string;
  context?: string;
  is_outbound?: boolean;
  is_affiliate?: boolean;
  affiliate?: string;
}) => trackEvent(p.is_affiliate ? "affiliate_click" : "program_click", p);

export const resourceClick = (p: {
  resource?: string;
  field?: string;
  link_url: string;
  city?: string;
  state?: string;
  position?: string;
  context?: string;
  is_outbound?: boolean;
  is_affiliate?: boolean;
  affiliate?: string;
}) => trackEvent(p.is_affiliate ? "affiliate_click" : "resource_click", p);
