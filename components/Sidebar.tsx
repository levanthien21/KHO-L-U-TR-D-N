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
    color: "text-teal-500",
  },
  {
    label: "Thanh toán",
    icon: CreditCard,
    href: "/payments",
    color: "text-emerald-500",
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
    <div className="space-y-4 py-6 flex flex-col h-full glass-sidebar text-slate-300 relative overflow-hidden">
      <div className="px-4 py-2 flex-1 relative z-10">
        <Link href="/" className="flex items-center pl-2 mb-14 group">
          <img src="/logo.png" alt="Nexos Solutions" className="w-10 h-10 mr-3 object-contain drop-shadow-[0_0_15px_rgba(20,184,166,0.3)] group-hover:scale-105 transition-transform duration-300" />
          <h1 className="text-xl font-bold tracking-tight text-slate-100">
            NEXOS<span className="text-teal-400 font-light ml-1 text-sm tracking-widest block -mt-1">SOLUTIONS</span>
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
                    isActive ? "text-slate-50 bg-slate-800 shadow-sm ring-1 ring-white/10" : "text-slate-400 hover:text-slate-50 hover:bg-slate-800/50"
                  )}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="active-nav"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-sky-400 to-teal-400 rounded-r-full"
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
