"use client";

import { useProjects } from "./context/ProjectContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, isPast, isToday, parseISO } from "date-fns";


export default function Dashboard() {
  const { projects } = useProjects();

  const totalActive = projects.filter((p) => p.status === "In Progress").length;
  const totalCompleted = projects.filter((p) => p.status === "Completed").length;
  const totalPendingPayments = projects
    .filter((p) => p.paymentStatus !== "Paid")
    .reduce((sum, p) => {
      // In a real app, you might want to calculate the exact remaining amount for partial payments
      return sum + p.totalPrice;
    }, 0);

  // Get upcoming deadlines (within 7 days) and overdue
  const upcomingProjects = [...projects]
    .filter((p) => p.paymentStatus !== "Paid")
    .sort((a, b) => new Date(a.paymentDueDate).getTime() - new Date(b.paymentDueDate).getTime())
    .slice(0, 5);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white shadow-sm border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{totalActive}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Completed Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">{totalCompleted}</div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-600">${totalPendingPayments.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold mb-4 text-gray-900">Upcoming & Overdue Payments</h2>
      <Card className="bg-white shadow-sm border-gray-100">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {upcomingProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                  No upcoming or overdue payments.
                </TableCell>
              </TableRow>
            ) : (
              upcomingProjects.map((project) => {
                const dueDate = parseISO(project.paymentDueDate);
                const isOverdue = isPast(dueDate) && !isToday(dueDate);

                return (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>{project.clientName}</TableCell>
                    <TableCell>${project.totalPrice.toLocaleString()}</TableCell>
                    <TableCell className={isOverdue ? "text-rose-600 font-medium" : ""}>
                      {format(dueDate, "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isOverdue ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {isOverdue ? "Overdue" : "Upcoming"}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
