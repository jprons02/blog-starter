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
