export type ProjectStatus = 'Not Started' | 'In Progress' | 'Completed';
export type PaymentStatus = 'Unpaid' | 'Partial' | 'Paid';

export interface Project {
  id: string;
  name: string;
  clientName: string;
  clientContact: string;
  totalPrice: number;
  status: ProjectStatus;
  paymentStatus: PaymentStatus;
  paymentDueDate: string;
  createdAt: string;
}
