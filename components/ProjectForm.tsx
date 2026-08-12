"use client";

import { useState } from "react";
import { Project, ProjectStatus, PaymentStatus } from "@/types";
import { useProjects } from "@/app/context/ProjectContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface ProjectFormProps {
  projectToEdit?: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectForm({ projectToEdit, open, onOpenChange }: ProjectFormProps) {
  const { addProject, updateProject } = useProjects();
  
  const [name, setName] = useState(projectToEdit?.name || "");
  const [clientName, setClientName] = useState(projectToEdit?.clientName || "");
  const [clientContact, setClientContact] = useState(projectToEdit?.clientContact || "");
  
  const [totalPriceStr, setTotalPriceStr] = useState(
    projectToEdit?.totalPrice ? projectToEdit.totalPrice.toString() : ""
  );
  
  const [status, setStatus] = useState<ProjectStatus>(projectToEdit?.status || "Chưa bắt đầu");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(projectToEdit?.paymentStatus || "Chưa thanh toán");
  
  const defaultDate = projectToEdit?.paymentDueDate 
    ? new Date(projectToEdit.paymentDueDate).toISOString().split('T')[0] 
    : new Date().toISOString().split('T')[0];
  const [paymentDueDate, setPaymentDueDate] = useState(defaultDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawPrice = parseFloat(totalPriceStr.replace(/,/g, '')) || 0;
    
    if (projectToEdit) {
      updateProject(projectToEdit.id, {
        name,
        clientName,
        clientContact,
        totalPrice: rawPrice,
        status,
        paymentStatus,
        paymentDueDate: new Date(paymentDueDate).toISOString(),
      });
    } else {
      addProject({
        id: crypto.randomUUID(),
        name,
        clientName,
        clientContact,
        totalPrice: rawPrice,
        status,
        paymentStatus,
        paymentDueDate: new Date(paymentDueDate).toISOString(),
        createdAt: new Date().toISOString(),
      });
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-[#0f111a] border-white/10 text-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{projectToEdit ? "Sửa Dự Án" : "Thêm Dự Án Mới"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-zinc-300">Tên dự án</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="bg-white/5 border-white/10 text-white focus-visible:ring-indigo-500" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName" className="text-zinc-300">Tên khách hàng</Label>
              <Input id="clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} required className="bg-white/5 border-white/10 text-white focus-visible:ring-indigo-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientContact" className="text-zinc-300">SĐT / Email</Label>
              <Input id="clientContact" value={clientContact} onChange={(e) => setClientContact(e.target.value)} required className="bg-white/5 border-white/10 text-white focus-visible:ring-indigo-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalPrice" className="text-zinc-300">Tổng tiền (VNĐ)</Label>
              <Input 
                id="totalPrice" 
                type="number" 
                min="0" 
                step="1000"
                value={totalPriceStr} 
                onChange={(e) => setTotalPriceStr(e.target.value)} 
                required 
                className="bg-white/5 border-white/10 text-white focus-visible:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentDueDate" className="text-zinc-300">Hạn thanh toán</Label>
              <Input id="paymentDueDate" type="date" value={paymentDueDate} onChange={(e) => setPaymentDueDate(e.target.value)} required className="bg-white/5 border-white/10 text-white focus-visible:ring-indigo-500 [color-scheme:dark]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-zinc-300">Trạng thái dự án</Label>
              <Select value={status} onValueChange={(v) => v && setStatus(v as ProjectStatus)}>
                <SelectTrigger id="status" className="bg-white/5 border-white/10 text-white focus:ring-indigo-500"><SelectValue placeholder="Chọn trạng thái" /></SelectTrigger>
                <SelectContent className="bg-[#1a1d2d] border-white/10 text-white">
                  <SelectItem value="Chưa bắt đầu" className="focus:bg-white/10 focus:text-white">Chưa bắt đầu</SelectItem>
                  <SelectItem value="Đang tiến hành" className="focus:bg-white/10 focus:text-white">Đang tiến hành</SelectItem>
                  <SelectItem value="Đã hoàn thành" className="focus:bg-white/10 focus:text-white">Đã hoàn thành</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentStatus" className="text-zinc-300">Trạng thái thanh toán</Label>
              <Select value={paymentStatus} onValueChange={(v) => v && setPaymentStatus(v as PaymentStatus)}>
                <SelectTrigger id="paymentStatus" className="bg-white/5 border-white/10 text-white focus:ring-indigo-500"><SelectValue placeholder="Chọn thanh toán" /></SelectTrigger>
                <SelectContent className="bg-[#1a1d2d] border-white/10 text-white">
                  <SelectItem value="Chưa thanh toán" className="focus:bg-white/10 focus:text-white">Chưa thanh toán</SelectItem>
                  <SelectItem value="Thanh toán một phần" className="focus:bg-white/10 focus:text-white">Thanh toán một phần</SelectItem>
                  <SelectItem value="Đã thanh toán" className="focus:bg-white/10 focus:text-white">Đã thanh toán</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all">
              {projectToEdit ? "Lưu Thay Đổi" : "Tạo Dự Án"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
