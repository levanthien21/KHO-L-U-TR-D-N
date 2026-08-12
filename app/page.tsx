"use client";

import { useProjects } from "./context/ProjectContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, isPast, isToday, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
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
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 tracking-tight">Tổng quan</h1>
          <p className="text-zinc-400 mt-2">Theo dõi tiến độ và dòng tiền của bạn.</p>
        </div>
      </motion.div>
      
      <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.div variants={item} className="premium-glow group">
          <Card className="glass-panel border-none h-full transition-transform duration-300 group-hover:-translate-y-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-indigo-300/80 uppercase tracking-wider">Dự án đang chạy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white tracking-tight">{totalActive}</div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={item} className="premium-glow group">
          <Card className="glass-panel border-none h-full transition-transform duration-300 group-hover:-translate-y-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-300/80 uppercase tracking-wider">Dự án hoàn thành</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white tracking-tight">{totalCompleted}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="premium-glow group">
          <Card className="glass-panel border-none h-full transition-transform duration-300 group-hover:-translate-y-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-rose-300/80 uppercase tracking-wider">Tiền chưa thu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white tracking-tight">{totalPendingPayments.toLocaleString("vi-VN")} <span className="text-2xl text-zinc-500 font-normal">₫</span></div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Sắp đến hạn & Quá hạn</h2>
        </div>
        <Card className="glass-panel border-none overflow-hidden">
          <Table>
            <TableHeader className="bg-black/20">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-zinc-400 font-medium">Tên dự án</TableHead>
                <TableHead className="text-zinc-400 font-medium">Khách hàng</TableHead>
                <TableHead className="text-zinc-400 font-medium">Số tiền</TableHead>
                <TableHead className="text-zinc-400 font-medium">Hạn chót</TableHead>
                <TableHead className="text-zinc-400 font-medium">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingProjects.length === 0 ? (
                <TableRow className="border-white/5 hover:bg-white/5">
                  <TableCell colSpan={5} className="text-center py-12 text-zinc-500">
                    Tuyệt vời! Không có dự án nào sắp đến hạn thanh toán.
                  </TableCell>
                </TableRow>
              ) : (
                upcomingProjects.map((project) => {
                  const dueDate = parseISO(project.paymentDueDate);
                  const isOverdue = isPast(dueDate) && !isToday(dueDate);

                  return (
                    <TableRow key={project.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                      <TableCell className="font-semibold text-white">{project.name}</TableCell>
                      <TableCell className="text-zinc-300">{project.clientName}</TableCell>
                      <TableCell className="text-zinc-300 font-medium">{project.totalPrice.toLocaleString("vi-VN")} ₫</TableCell>
                      <TableCell className={isOverdue ? "text-rose-400 font-semibold" : "text-zinc-300"}>
                        {format(dueDate, "dd/MM/yyyy", { locale: vi })}
                      </TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border ${
                          isOverdue ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
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
