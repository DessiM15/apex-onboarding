import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "APEX Client Onboarding | BotMakers.ai",
  description:
    "Complete your onboarding form before your kickoff call so our team can customize your campaign from day one.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
