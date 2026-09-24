import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { APP_CONFIG } from "@/config/app-config";
import { ThemeProvider } from "@/context/theme-context";
import { WorkspaceProvider } from "@/context/workspace-context";
import { PostsProvider } from "@/context/posts-context";
import { NotificationProvider } from "@/context/notification-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${APP_CONFIG.name} — ${APP_CONFIG.tagline}`,
  description: APP_CONFIG.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <ThemeProvider>
          <WorkspaceProvider>
            <PostsProvider>
              <NotificationProvider>{children}</NotificationProvider>
            </PostsProvider>
          </WorkspaceProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

