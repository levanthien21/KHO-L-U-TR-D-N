"use client";

import { useState } from "react";
import { useProjects } from "../context/ProjectContext";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Project } from "@/types";
import { format, parseISO, isPast, isToday } from "date-fns";
import { vi } from "date-fns/locale";
import { Bell, Copy, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
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

export default function PaymentsPage() {
  const { projects } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const pendingProjects = projects
    .filter((p) => p.paymentStatus !== "Đã thanh toán")
    .sort((a, b) => new Date(a.paymentDueDate).getTime() - new Date(b.paymentDueDate).getTime());

  const handleGenerateReminder = (project: Project) => {
    setSelectedProject(project);
    setIsReminderOpen(true);
    setCopied(false);
  };

  const getReminderTemplate = (project: Project) => {
    return `Kính gửi anh/chị ${project.clientName},

Em hy vọng anh/chị đang có một ngày làm việc hiệu quả.

Em viết email này để nhắc nhẹ về khoản thanh toán ${project.totalPrice.toLocaleString("vi-VN")} ₫ cho dự án "${project.name}". Theo như thỏa thuận, hạn thanh toán là ngày ${format(parseISO(project.paymentDueDate), "dd/MM/yyyy")}.

Anh/chị vui lòng kiểm tra và phản hồi lại giúp em nhé. Nếu anh/chị đã tiến hành thanh toán rồi thì vui lòng bỏ qua email/tin nhắn này ạ.

Cảm ơn anh/chị đã tin tưởng và hợp tác!

Trân trọng,
[Tên của bạn]`;
  };

  const copyToClipboard = () => {
    if (selectedProject) {
      navigator.clipboard.writeText(getReminderTemplate(selectedProject));
      setCopied(true);
      toast.success("Đã sao chép vào bộ nhớ tạm", {
        description: "Mẫu nhắc nhở đã sẵn sàng để bạn dán vào email/tin nhắn.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={container}
      className="p-8 max-w-7xl mx-auto"
    >
      <motion.div variants={item} className="mb-10">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 tracking-tight">Thanh toán</h1>
        <p className="text-zinc-400 mt-2">Theo dõi các khoản tiền đang chờ và quá hạn.</p>
      </motion.div>

      <motion.div variants={item}>
        <Card className="glass-panel border-none overflow-hidden">
          <Table>
            <TableHeader className="bg-black/20">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-zinc-400 font-medium py-4">Tên Dự Án</TableHead>
                <TableHead className="text-zinc-400 font-medium">Khách Hàng</TableHead>
                <TableHead className="text-zinc-400 font-medium">Số Tiền Cần Thu</TableHead>
                <TableHead className="text-zinc-400 font-medium">Hạn Chót</TableHead>
                <TableHead className="text-zinc-400 font-medium">Trạng Thái</TableHead>
                <TableHead className="text-right text-zinc-400 font-medium">Hành Động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingProjects.length === 0 ? (
                <TableRow className="border-white/5 hover:bg-white/5">
                  <TableCell colSpan={6} className="text-center py-16 text-zinc-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                      </div>
                      <p>Tuyệt vời! Không có khoản nợ nào đang chờ thanh toán.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                pendingProjects.map((project) => {
                  const dueDate = parseISO(project.paymentDueDate);
                  const isOverdue = isPast(dueDate) && !isToday(dueDate);

                  return (
                    <TableRow key={project.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                      <TableCell className="font-semibold text-white">{project.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-zinc-200">{project.clientName}</span>
                          <span className="text-xs text-zinc-500">{project.clientContact}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-zinc-300">
                        {project.totalPrice.toLocaleString("vi-VN")} ₫
                      </TableCell>
                      <TableCell className={isOverdue ? "text-rose-400 font-semibold" : "text-zinc-300"}>
                        {format(dueDate, "dd/MM/yyyy", { locale: vi })}
                      </TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border ${
                          isOverdue ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}>
                          {isOverdue ? "Quá hạn" : "Đang chờ"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            onClick={() => handleGenerateReminder(project)}
                            size="sm"
                            className={`rounded-lg shadow-lg transition-all ${
                              isOverdue 
                                ? "bg-rose-600 hover:bg-rose-500 text-white hover:shadow-rose-500/25" 
                                : "bg-indigo-600/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30"
                            }`}
                          >
                            <Bell className="mr-2 h-3 w-3" /> 
                            Tạo Nhắc Nhở
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>
      </motion.div>

      <Dialog open={isReminderOpen} onOpenChange={setIsReminderOpen}>
        <DialogContent className="sm:max-w-md bg-[#0f111a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Mẫu Nhắc Nhở Thanh Toán</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Sao chép mẫu này để gửi lời nhắc nhở chuyên nghiệp tới khách hàng của bạn.
            </DialogDescription>
          </DialogHeader>
          
          {selectedProject && (
            <div className="mt-4">
              <div className="bg-black/40 p-4 rounded-xl text-sm text-zinc-300 whitespace-pre-wrap font-mono border border-white/5 leading-relaxed selection:bg-indigo-500/30">
                {getReminderTemplate(selectedProject)}
              </div>
            </div>
          )}

          <DialogFooter className="mt-4 flex sm:justify-between border-t border-white/5 pt-4">
            <Button variant="ghost" onClick={() => setIsReminderOpen(false)} className="hover:bg-white/5 hover:text-white">
              Đóng
            </Button>
            <Button onClick={copyToClipboard} className="bg-indigo-600 hover:bg-indigo-500 text-white min-w-[130px] rounded-lg shadow-lg hover:shadow-indigo-500/25">
              {copied ? (
                <><CheckCircle2 className="mr-2 h-4 w-4" /> Đã chép</>
              ) : (
                <><Copy className="mr-2 h-4 w-4" /> Sao chép</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
