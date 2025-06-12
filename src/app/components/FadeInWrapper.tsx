"use client";

import FadeIn from "./FadeIn";

export default function FadeInWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FadeIn>{children}</FadeIn>;
}
