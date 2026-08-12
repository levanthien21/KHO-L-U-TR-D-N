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
  const [totalPrice, setTotalPrice] = useState(projectToEdit?.totalPrice.toString() || "");
  const [status, setStatus] = useState<ProjectStatus>(projectToEdit?.status || "Not Started");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(projectToEdit?.paymentStatus || "Unpaid");
  
  // Format date for input type="date"
  const defaultDate = projectToEdit?.paymentDueDate 
    ? new Date(projectToEdit.paymentDueDate).toISOString().split('T')[0] 
    : new Date().toISOString().split('T')[0];
  const [paymentDueDate, setPaymentDueDate] = useState(defaultDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (projectToEdit) {
      updateProject(projectToEdit.id, {
        name,
        clientName,
        clientContact,
        totalPrice: parseFloat(totalPrice) || 0,
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
        totalPrice: parseFloat(totalPrice) || 0,
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{projectToEdit ? "Edit Project" : "Add New Project"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input id="clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientContact">Client Contact</Label>
              <Input id="clientContact" value={clientContact} onChange={(e) => setClientContact(e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalPrice">Total Price ($)</Label>
              <Input id="totalPrice" type="number" min="0" step="0.01" value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentDueDate">Payment Due Date</Label>
              <Input id="paymentDueDate" type="date" value={paymentDueDate} onChange={(e) => setPaymentDueDate(e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Project Status</Label>
              <Select value={status} onValueChange={(v) => v && setStatus(v as ProjectStatus)}>
                <SelectTrigger id="status"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentStatus">Payment Status</Label>
              <Select value={paymentStatus} onValueChange={(v) => v && setPaymentStatus(v as PaymentStatus)}>
                <SelectTrigger id="paymentStatus"><SelectValue placeholder="Payment Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Unpaid">Unpaid</SelectItem>
                  <SelectItem value="Partial">Partial</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button type="submit" className="w-full">
              {projectToEdit ? "Save Changes" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
