// Core Types for Richezza Mega Value Billing Application

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  department?: string;
  avatar?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  taxId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  client: Client;
  date: Date;
  dueDate: Date;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  position: string;
  department: string;
  hireDate: Date;
  salary: number;
  allowances: {
    housing: number;
    transport: number;
    medical: number;
    other: number;
  };
  deductions: {
    tax: number;
    insurance: number;
    providentFund: number;
    other: number;
  };
  bankAccount: {
    accountNumber: string;
    bankName: string;
    routingNumber: string;
  };
  status: 'active' | 'inactive' | 'terminated';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PayrollEntry {
  id: string;
  employeeId: string;
  employee: Employee;
  month: string;
  year: number;
  workingDays: number;
  presentDays: number;
  absentDays: number;
  overtimeHours: number;
  baseSalary: number;
  allowances: number;
  overtimePay: number;
  grossSalary: number;
  deductions: number;
  netSalary: number;
  status: 'draft' | 'processed' | 'paid';
  processedAt?: Date;
  createdAt: Date;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employee: Employee;
  date: Date;
  clockIn?: Date;
  clockOut?: Date;
  breakStart?: Date;
  breakEnd?: Date;
  totalHours: number;
  overtimeHours: number;
  status: 'present' | 'absent' | 'late' | 'half-day' | 'on-leave';
  notes?: string;
  createdAt: Date;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employee: Employee;
  type: 'annual' | 'sick' | 'personal' | 'maternity' | 'emergency';
  startDate: Date;
  endDate: Date;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
}

export interface DashboardStats {
  totalRevenue: number;
  monthlyRevenue: number;
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  totalEmployees: number;
  activeEmployees: number;
  totalClients: number;
  monthlyPayroll: number;
}

export interface ReportFilter {
  startDate: Date;
  endDate: Date;
  department?: string;
  status?: string;
  employeeId?: string;
  clientId?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface ClientForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  taxId?: string;
}

export interface EmployeeForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  position: string;
  department: string;
  salary: number;
  hireDate: Date;
  allowances: {
    housing: number;
    transport: number;
    medical: number;
    other: number;
  };
  bankAccount: {
    accountNumber: string;
    bankName: string;
    routingNumber: string;
  };
}

export interface InvoiceForm {
  clientId: string;
  date: Date;
  dueDate: Date;
  items: InvoiceItem[];
  taxRate: number;
  notes?: string;
}