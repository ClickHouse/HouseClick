import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import ThemeProvider from "@/providers";


// Initialize the font object
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});


export const metadata: Metadata = {
  title: "UK Property Finder",
  description: "Find your dream property in the UK with our listing app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
