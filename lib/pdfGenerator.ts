import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Project } from "@/types";
import { format, parseISO } from "date-fns";

export function generateInvoice(project: Project) {
  const doc = new jsPDF();

  // Add Logo or Header
  doc.setFontSize(22);
  doc.setTextColor(30, 41, 59);
  doc.text("INVOICE", 14, 22);
  
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text("Nexos Solutions", 14, 30);
  doc.text("Your reliable tech partner", 14, 36);

  // Invoice Details
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text(`Invoice Number: INV-${project.id.slice(-6).toUpperCase()}`, 130, 22);
  
  const dueDate = project.paymentDueDate ? format(parseISO(project.paymentDueDate), "dd/MM/yyyy") : "N/A";
  doc.text(`Date: ${format(new Date(), "dd/MM/yyyy")}`, 130, 28);
  doc.text(`Due Date: ${dueDate}`, 130, 34);

  // Client Details
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 14, 50);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(project.clientName, 14, 56);
  if (project.clientContact) {
    doc.text(project.clientContact, 14, 62);
  }

  // Table
  autoTable(doc, {
    startY: 75,
    headStyles: { fillColor: [99, 102, 241], textColor: 255 },
    head: [["Description", "Quantity", "Unit Price", "Total"]],
    body: [
      [project.name, "1", `${project.totalPrice.toLocaleString("vi-VN")} VND`, `${project.totalPrice.toLocaleString("vi-VN")} VND`],
    ],
    theme: "striped",
    styles: {
      font: "helvetica",
      fontSize: 10,
    }
  });

  // Total
  const finalY = (doc as any).lastAutoTable.finalY || 100;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Total Due: ${project.totalPrice.toLocaleString("vi-VN")} VND`, 130, finalY + 15);

  // Footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text("Thank you for your business!", 105, 280, { align: "center" });

  doc.save(`Invoice_${project.name.replace(/\s+/g, "_")}.pdf`);
}
