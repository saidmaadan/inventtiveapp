import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "AI-Powered Content Generation Platform",
  description: "Generate high-quality content for your business in minutes with our AI-powered platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body className={inter.className}>
    
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <main className="overflow-x-hidden">
            {children}
        </main>
        <Toaster/>
        </ThemeProvider>
      
    </body>
  </html>
  );
}
