"use client";

import { useState } from "react";
import { useProjects } from "../context/ProjectContext";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Project } from "@/types";
import { format, parseISO, isPast, isToday } from "date-fns";
import { Bell, Copy, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function PaymentsPage() {
  const { projects } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const pendingProjects = projects
    .filter((p) => p.paymentStatus !== "Paid")
    .sort((a, b) => new Date(a.paymentDueDate).getTime() - new Date(b.paymentDueDate).getTime());

  const handleGenerateReminder = (project: Project) => {
    setSelectedProject(project);
    setIsReminderOpen(true);
    setCopied(false);
  };

  const getReminderTemplate = (project: Project) => {
    return `Dear ${project.clientName},

I hope this message finds you well. 

This is a gentle reminder that the payment of $${project.totalPrice.toLocaleString()} for the project "${project.name}" is due on ${format(parseISO(project.paymentDueDate), "MMMM do, yyyy")}.

Please let me know if you have any questions or if the payment has already been processed.

Thank you for your business!

Best regards,
[Your Name]`;
  };

  const copyToClipboard = () => {
    if (selectedProject) {
      navigator.clipboard.writeText(getReminderTemplate(selectedProject));
      setCopied(true);
      toast.success("Copied to clipboard", {
        description: "The reminder template is ready to paste into your email.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Payments</h1>

      <Card className="bg-white shadow-sm border-gray-100">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Amount Due</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                  All caught up! No pending payments.
                </TableCell>
              </TableRow>
            ) : (
              pendingProjects.map((project) => {
                const dueDate = parseISO(project.paymentDueDate);
                const isOverdue = isPast(dueDate) && !isToday(dueDate);

                return (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{project.clientName}</span>
                        <span className="text-xs text-gray-500">{project.clientContact}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      ${project.totalPrice.toLocaleString()}
                    </TableCell>
                    <TableCell className={isOverdue ? "text-rose-600 font-medium" : ""}>
                      {format(dueDate, "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isOverdue ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {isOverdue ? "Overdue" : "Pending"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        onClick={() => handleGenerateReminder(project)}
                        size="sm"
                        variant={isOverdue ? "default" : "outline"}
                        className={isOverdue ? "bg-rose-600 hover:bg-rose-700" : ""}
                      >
                        <Bell className="mr-2 h-3 w-3" /> 
                        Reminder
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={isReminderOpen} onOpenChange={setIsReminderOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Reminder Template</DialogTitle>
            <DialogDescription>
              Copy this template to send a professional reminder to your client.
            </DialogDescription>
          </DialogHeader>
          
          {selectedProject && (
            <div className="mt-4">
              <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-800 whitespace-pre-wrap font-mono border border-gray-200">
                {getReminderTemplate(selectedProject)}
              </div>
            </div>
          )}

          <DialogFooter className="mt-4 flex sm:justify-between">
            <Button variant="outline" onClick={() => setIsReminderOpen(false)}>
              Close
            </Button>
            <Button onClick={copyToClipboard} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]">
              {copied ? (
                <><CheckCircle2 className="mr-2 h-4 w-4" /> Copied</>
              ) : (
                <><Copy className="mr-2 h-4 w-4" /> Copy to Clipboard</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
