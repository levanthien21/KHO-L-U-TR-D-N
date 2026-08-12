"use client";

import { useState } from "react";
import { useProjects } from "../context/ProjectContext";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import { ProjectForm } from "@/components/ProjectForm";
import { Project } from "@/types";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
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

export default function ProjectsPage() {
  const { projects, deleteProject } = useProjects();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  const handleAdd = () => {
    setProjectToEdit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (project: Project) => {
    setProjectToEdit(project);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa dự án này không?")) {
      deleteProject(id);
      toast.success("Đã xóa dự án", {
        description: "Dự án đã được gỡ khỏi danh sách của bạn.",
      });
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={container}
      className="p-8 max-w-7xl mx-auto"
    >
      <motion.div variants={item} className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 tracking-tight">Dự án</h1>
          <p className="text-zinc-400 mt-2">Quản lý tất cả các dự án freelance của bạn tại đây.</p>
        </div>
        <Button onClick={handleAdd} className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg hover:shadow-indigo-500/25 transition-all rounded-xl">
          <Plus className="mr-2 h-4 w-4" /> Thêm Dự Án
        </Button>
      </motion.div>

      <motion.div variants={item}>
        <Card className="glass-panel border-none overflow-hidden">
          <Table>
            <TableHeader className="bg-black/20">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-zinc-400 font-medium py-4">Tên Dự Án</TableHead>
                <TableHead className="text-zinc-400 font-medium">Khách Hàng</TableHead>
                <TableHead className="text-zinc-400 font-medium">Tổng Tiền</TableHead>
                <TableHead className="text-zinc-400 font-medium">Trạng Thái</TableHead>
                <TableHead className="text-zinc-400 font-medium">Hạn Chót</TableHead>
                <TableHead className="text-right text-zinc-400 font-medium">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.length === 0 ? (
                <TableRow className="border-white/5 hover:bg-white/5">
                  <TableCell colSpan={6} className="text-center py-16 text-zinc-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Briefcase className="h-8 w-8 text-zinc-400" />
                      </div>
                      <p>Chưa có dự án nào. Bấm "Thêm Dự Án" để bắt đầu.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project) => (
                  <TableRow key={project.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                    <TableCell className="font-semibold text-white">{project.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-zinc-200">{project.clientName}</span>
                        <span className="text-xs text-zinc-500">{project.clientContact}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-zinc-300">{project.totalPrice.toLocaleString("vi-VN")} ₫</TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border ${
                        project.status === "Đã hoàn thành" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        project.status === "Đang tiến hành" ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" :
                        "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                      }`}>
                        {project.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-zinc-300">{format(parseISO(project.paymentDueDate), "dd/MM/yyyy", { locale: vi })}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(project)} className="hover:bg-indigo-500/20 hover:text-indigo-400 rounded-lg">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(project.id)} className="hover:bg-rose-500/20 hover:text-rose-400 rounded-lg">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </motion.div>

      {isFormOpen && (
        <ProjectForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          projectToEdit={projectToEdit}
        />
      )}
    </motion.div>
  );
}
