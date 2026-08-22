import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import LiveTicker from "@/components/LiveTicker";
import { Sun } from "lucide-react";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "SunShare — Community Solar & Virtual Net Metering",
  description:
    "No roof? No problem. Subscribe to local community solar plants and cut your DISCOM bill through virtual net metering.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable} ${mono.variable}`}>
      <body>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#0F172A",
              color: "#F8FAFC",
              border: "1px solid rgba(245,158,11,0.3)",
              fontFamily: "var(--font-inter)",
            },
          }}
        />
        <Navbar />
        <LiveTicker />
        <main className="min-h-[calc(100vh-7rem)]">{children}</main>
        <footer className="border-t border-surface-muted bg-navy">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-ink/60 sm:flex-row sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gold text-navy-dark">
                <Sun className="h-3.5 w-3.5" />
              </span>
              <span className="font-display font-semibold text-ink">SunShare</span>
            </div>
            <p className="font-mono text-xs">
              Built for a 24-hour hackathon · Mock data only · Not affiliated with any DISCOM
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
