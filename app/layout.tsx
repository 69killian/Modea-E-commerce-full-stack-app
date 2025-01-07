import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToasterProvider } from "@/providers/toast-provider";
import { ThemeProvider } from "@/providers/theme-provider";


import { ModalProvider } from "@/providers/modal-provider";



export const metadata: Metadata = {
  title: "Modea Dashboard",
  description: "Admin Dashboard of Modea Website",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <ToasterProvider/>
        <ModalProvider/>
        {children}
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
