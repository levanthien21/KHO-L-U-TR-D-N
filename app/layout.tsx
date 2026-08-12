import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ProjectProvider } from "./context/ProjectContext";
import { RepositoryProvider } from "./context/RepositoryContext";
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
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-slate-900 text-slate-50 flex overflow-hidden selection:bg-sky-500/30 selection:text-sky-200`}>
        <ProjectProvider>
          <RepositoryProvider>
            <div className="w-64 h-full hidden md:block z-10 relative">
              <Sidebar />
            </div>
            <main className="flex-1 overflow-y-auto relative z-0">
              {children}
            </main>
            <Toaster richColors position="top-right" theme="dark" />
          </RepositoryProvider>
        </ProjectProvider>
      </body>
    </html>
  );
}
