import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Instrument Serif from Google Fonts
const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  display: "swap",
});

// Perfectly Nineties font
const perfectlyNineties = localFont({
  src: "./fonts/perfectly-nineties-regular.otf",
  weight: "100 900", // Allow all weights since it's a display font
  variable: "--font-nineties",
  display: "swap",
});

export const metadata: Metadata = {
  title: "500 AI Residency - Visitor Registration",
  description:
    "Quick and secure visitor registration for 500 AI Residency. Register for your digital visitor pass.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className="dark overflow-x-hidden"
        suppressHydrationWarning
      >
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${perfectlyNineties.variable} antialiased overflow-x-hidden`}
        >
          <ConvexClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <TooltipProvider>
                {children}
                <Toaster />
              </TooltipProvider>
            </ThemeProvider>
          </ConvexClientProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
