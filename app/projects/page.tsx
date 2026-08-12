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
import { toast } from "sonner";

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
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProject(id);
      toast.success("Project Deleted", {
        description: "The project has been removed from your list.",
      });
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
        <Button onClick={handleAdd} className="bg-violet-600 hover:bg-violet-700">
          <Plus className="mr-2 h-4 w-4" /> Add Project
        </Button>
      </div>

      <Card className="bg-white shadow-sm border-gray-100">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                  No projects yet. Click "Add Project" to get started.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{project.clientName}</span>
                      <span className="text-xs text-gray-500">{project.clientContact}</span>
                    </div>
                  </TableCell>
                  <TableCell>${project.totalPrice.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === "Completed" ? "bg-emerald-100 text-emerald-700" :
                      project.status === "In Progress" ? "bg-sky-100 text-sky-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {project.status}
                    </span>
                  </TableCell>
                  <TableCell>{format(parseISO(project.paymentDueDate), "MMM dd, yyyy")}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(project)}>
                      <Edit className="h-4 w-4 text-gray-500 hover:text-blue-600" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(project.id)}>
                      <Trash2 className="h-4 w-4 text-gray-500 hover:text-rose-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {isFormOpen && (
        <ProjectForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          projectToEdit={projectToEdit}
        />
      )}
    </div>
  );
}
