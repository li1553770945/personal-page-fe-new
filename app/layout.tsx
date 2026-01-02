"use client"

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../lib/i18n"
import Header from "@/components/global/header/Header";
import Footer from "@/components/global/footer/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import { NotificationList } from "@/components/global/notification-list";
import dynamic from 'next/dynamic';
// 禁用 SSR
const Live2D = dynamic(() => import("@/components/global/live2d/initializer"), { ssr: false });
const ChatDialog = dynamic(() => import("@/components/global/live2d/chat-dialog"), { ssr: false });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>PeaceSheep的个人主页</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <div className="flex flex-col min-h-screen w-full max-w-7xl mx-auto bg-background">
            <main className="flex-1 w-full px-4 md:px-6">
              {children}
            </main>
            <Footer />
          </div>
          <NotificationList />
          <Live2D  />
          <ChatDialog />
        </ThemeProvider>
      </body>
    </html>
  );
}
