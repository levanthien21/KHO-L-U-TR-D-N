import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ProjectProvider } from "./context/ProjectContext";
import { Sidebar } from "@/components/Sidebar";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FreelanceDash",
  description: "Personal Freelancer Project Management Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-background text-foreground flex overflow-hidden`}>
        <ProjectProvider>
          <div className="w-64 h-full hidden md:block z-10 relative">
            <Sidebar />
          </div>
          <main className="flex-1 overflow-y-auto relative z-0">
            {children}
          </main>
          <Toaster richColors position="top-right" theme="dark" />
        </ProjectProvider>
      </body>
    </html>
  );
}
