import "./globals.css";
import ThemeToggle from "@/app/components/ToggleButtonLightDark";
import NavBar from "@/app/components/NavBar";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head />
      <body>
        <NavBar />
        {children}

        <div className="fixed bottom-4 right-4 z-50">
          <ThemeToggle />
        </div>
      </body>
    </html>
  );
}
