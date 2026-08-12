export type ProjectStatus = 'Chưa bắt đầu' | 'Đang tiến hành' | 'Đã hoàn thành';
export type PaymentStatus = 'Chưa thanh toán' | 'Thanh toán một phần' | 'Đã thanh toán';

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
