"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Briefcase, CreditCard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const routes = [
  {
    label: "Tổng quan",
    icon: LayoutDashboard,
    href: "/",
    color: "text-sky-600",
  },
  {
    label: "Dự án",
    icon: Briefcase,
    href: "/projects",
    color: "text-violet-600",
  },
  {
    label: "Thanh toán",
    icon: CreditCard,
    href: "/payments",
    color: "text-emerald-600",
  },
  {
    label: "Cài đặt",
    icon: Settings,
    href: "/settings",
    color: "text-slate-500",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-6 flex flex-col h-full bg-white border-r border-slate-200 text-slate-700 relative overflow-hidden">
      <div className="px-4 py-2 flex-1 relative z-10">
        <Link href="/" className="flex items-center pl-2 mb-14 group">
          <div className="relative w-9 h-9 mr-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-indigo-500/50 transition-all duration-300">
            F
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Freelance<span className="text-indigo-600">Dash</span>
          </h1>
        </Link>
        <div className="space-y-2">
          {routes.map((route) => {
            const isActive = pathname === route.href;
            
            return (
              <Link
                key={route.href}
                href={route.href}
                className="block relative"
              >
                <motion.div 
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-xl transition-all duration-200",
                    isActive ? "text-indigo-700 bg-indigo-50/80 shadow-sm ring-1 ring-indigo-100" : "text-slate-500 hover:text-indigo-600 hover:bg-slate-50"
                  )}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="active-nav"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full"
                    />
                  )}
                  <div className="flex items-center flex-1 z-10 pl-1">
                    <route.icon className={cn("h-5 w-5 mr-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3", route.color)} />
                    {route.label}
                  </div>
                </motion.div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  );
}
