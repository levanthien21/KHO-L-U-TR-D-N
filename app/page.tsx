"use client";

import { useProjects } from "./context/ProjectContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, isPast, isToday, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { motion, Variants } from "framer-motion";
import { RevenueChart } from "@/components/RevenueChart";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Dashboard() {
  const { projects } = useProjects();

  const totalActive = projects.filter((p) => p.status === "Đang tiến hành").length;
  const totalCompleted = projects.filter((p) => p.status === "Đã hoàn thành").length;
  const totalPendingPayments = projects
    .filter((p) => p.paymentStatus !== "Đã thanh toán")
    .reduce((sum, p) => sum + p.totalPrice, 0);

  const upcomingProjects = [...projects]
    .filter((p) => p.paymentStatus !== "Đã thanh toán")
    .sort((a, b) => new Date(a.paymentDueDate).getTime() - new Date(b.paymentDueDate).getTime())
    .slice(0, 5);

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={container}
      className="p-8 max-w-7xl mx-auto"
    >
      <motion.div variants={item} className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-400 tracking-tight">Tổng quan</h1>
          <p className="text-slate-400 mt-2">Theo dõi tiến độ và dòng tiền của bạn.</p>
        </div>
      </motion.div>
      
      <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.div variants={item}>
          <Card className="glass-panel border-none h-full rounded-2xl transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-white/10 hover:-translate-y-1">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Dự án đang chạy</CardTitle>
              <div className="h-10 w-10 bg-slate-800/80 text-sky-400 rounded-full flex items-center justify-center ring-1 ring-white/5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-slate-50 tracking-tight">{totalActive}</div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card className="glass-panel border-none h-full rounded-2xl transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-white/10 hover:-translate-y-1">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Dự án hoàn thành</CardTitle>
              <div className="h-10 w-10 bg-slate-800/80 text-teal-400 rounded-full flex items-center justify-center ring-1 ring-white/5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-slate-50 tracking-tight">{totalCompleted}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="glass-panel border-none h-full rounded-2xl transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-white/10 hover:-translate-y-1">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Tiền chưa thu</CardTitle>
              <div className="h-10 w-10 bg-slate-800/80 text-sky-300 rounded-full flex items-center justify-center ring-1 ring-white/5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-slate-50 tracking-tight">{totalPendingPayments.toLocaleString("vi-VN")} <span className="text-2xl text-slate-400 font-normal">₫</span></div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div variants={item} className="mb-12">
        <RevenueChart />
      </motion.div>

      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-50 tracking-tight">Sắp đến hạn & Quá hạn</h2>
        </div>
        <Card className="bg-slate-800/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-xl">
          <Table>
            <TableHeader className="bg-slate-800/80 border-b border-white/5">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="text-slate-400 font-semibold uppercase text-xs tracking-wider h-12">Tên dự án</TableHead>
                <TableHead className="text-slate-400 font-semibold uppercase text-xs tracking-wider h-12">Khách hàng</TableHead>
                <TableHead className="text-slate-400 font-semibold uppercase text-xs tracking-wider h-12">Số tiền</TableHead>
                <TableHead className="text-slate-400 font-semibold uppercase text-xs tracking-wider h-12">Hạn chót</TableHead>
                <TableHead className="text-slate-400 font-semibold uppercase text-xs tracking-wider h-12">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingProjects.length === 0 ? (
                <TableRow className="border-b-0 hover:bg-slate-800/50">
                  <TableCell colSpan={5} className="text-center py-16 text-slate-500">
                    Tuyệt vời! Không có dự án nào sắp đến hạn thanh toán.
                  </TableCell>
                </TableRow>
              ) : (
                upcomingProjects.map((project) => {
                  const dueDate = parseISO(project.paymentDueDate);
                  const isOverdue = isPast(dueDate) && !isToday(dueDate);

                  return (
                    <TableRow key={project.id} className="border-b border-white/5 hover:bg-slate-800/60 transition-colors group">
                      <TableCell className="font-semibold text-slate-200 py-4">{project.name}</TableCell>
                      <TableCell className="text-slate-400 py-4">{project.clientName}</TableCell>
                      <TableCell className="text-slate-200 font-medium py-4">{project.totalPrice.toLocaleString("vi-VN")} ₫</TableCell>
                      <TableCell className={isOverdue ? "text-rose-400 font-semibold py-4" : "text-slate-400 py-4"}>
                        {format(dueDate, "dd/MM/yyyy", { locale: vi })}
                      </TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border ${
                          isOverdue ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-sky-500/10 text-sky-400 border-sky-500/20"
                        }`}>
                          {isOverdue ? "Quá hạn" : "Sắp tới"}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>
      </motion.div>
    </motion.div>
  );
}
