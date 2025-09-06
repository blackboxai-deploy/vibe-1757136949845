// Local Storage Management for Richezza Mega Value Application

import { 
  Client, 
  Employee, 
  Invoice, 
  PayrollEntry, 
  AttendanceRecord, 
  LeaveRequest, 
  User 
} from '@/types';

// Storage Keys
const STORAGE_KEYS = {
  CLIENTS: 'rmv_clients',
  EMPLOYEES: 'rmv_employees',
  INVOICES: 'rmv_invoices',
  PAYROLL: 'rmv_payroll',
  ATTENDANCE: 'rmv_attendance',
  LEAVE_REQUESTS: 'rmv_leave_requests',
  CURRENT_USER: 'rmv_current_user',
  SETTINGS: 'rmv_settings'
} as const;

// Generic Storage Functions
export const storage = {
  // Get data from localStorage
  get: <T>(key: string): T[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  // Save data to localStorage
  set: <T>(key: string, data: T[]): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  // Get single item by ID
  getById: <T extends { id: string }>(key: string, id: string): T | null => {
    const items = storage.get<T>(key);
    return items.find(item => item.id === id) || null;
  },

  // Add new item
  add: <T extends { id: string }>(key: string, item: T): void => {
    const items = storage.get<T>(key);
    items.push(item);
    storage.set(key, items);
  },

  // Update existing item
  update: <T extends { id: string }>(key: string, id: string, updates: Partial<T>): void => {
    const items = storage.get<T>(key);
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      storage.set(key, items);
    }
  },

  // Delete item
  delete: (key: string, id: string): void => {
    const items = storage.get(key);
    const filtered = items.filter((item: any) => item.id !== id);
    storage.set(key, filtered);
  },

  // Clear all data for a key
  clear: (key: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },

  // Clear all application data
  clearAll: (): void => {
    if (typeof window === 'undefined') return;
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};

// Specific Storage Functions
export const clientStorage = {
  getAll: (): Client[] => storage.get<Client>(STORAGE_KEYS.CLIENTS),
  getById: (id: string): Client | null => storage.getById<Client>(STORAGE_KEYS.CLIENTS, id),
  create: (client: Client): void => storage.add(STORAGE_KEYS.CLIENTS, client),
  update: (id: string, updates: Partial<Client>): void => storage.update(STORAGE_KEYS.CLIENTS, id, updates),
  delete: (id: string): void => storage.delete(STORAGE_KEYS.CLIENTS, id)
};

export const employeeStorage = {
  getAll: (): Employee[] => storage.get<Employee>(STORAGE_KEYS.EMPLOYEES),
  getById: (id: string): Employee | null => storage.getById<Employee>(STORAGE_KEYS.EMPLOYEES, id),
  create: (employee: Employee): void => storage.add(STORAGE_KEYS.EMPLOYEES, employee),
  update: (id: string, updates: Partial<Employee>): void => storage.update(STORAGE_KEYS.EMPLOYEES, id, updates),
  delete: (id: string): void => storage.delete(STORAGE_KEYS.EMPLOYEES, id),
  getByDepartment: (department: string): Employee[] => {
    return storage.get<Employee>(STORAGE_KEYS.EMPLOYEES).filter(emp => emp.department === department);
  },
  getActiveEmployees: (): Employee[] => {
    return storage.get<Employee>(STORAGE_KEYS.EMPLOYEES).filter(emp => emp.status === 'active');
  }
};

export const invoiceStorage = {
  getAll: (): Invoice[] => storage.get<Invoice>(STORAGE_KEYS.INVOICES),
  getById: (id: string): Invoice | null => storage.getById<Invoice>(STORAGE_KEYS.INVOICES, id),
  create: (invoice: Invoice): void => storage.add(STORAGE_KEYS.INVOICES, invoice),
  update: (id: string, updates: Partial<Invoice>): void => storage.update(STORAGE_KEYS.INVOICES, id, updates),
  delete: (id: string): void => storage.delete(STORAGE_KEYS.INVOICES, id),
  getByStatus: (status: Invoice['status']): Invoice[] => {
    return storage.get<Invoice>(STORAGE_KEYS.INVOICES).filter(inv => inv.status === status);
  },
  getByClient: (clientId: string): Invoice[] => {
    return storage.get<Invoice>(STORAGE_KEYS.INVOICES).filter(inv => inv.clientId === clientId);
  }
};

export const payrollStorage = {
  getAll: (): PayrollEntry[] => storage.get<PayrollEntry>(STORAGE_KEYS.PAYROLL),
  getById: (id: string): PayrollEntry | null => storage.getById<PayrollEntry>(STORAGE_KEYS.PAYROLL, id),
  create: (payroll: PayrollEntry): void => storage.add(STORAGE_KEYS.PAYROLL, payroll),
  update: (id: string, updates: Partial<PayrollEntry>): void => storage.update(STORAGE_KEYS.PAYROLL, id, updates),
  delete: (id: string): void => storage.delete(STORAGE_KEYS.PAYROLL, id),
  getByEmployee: (employeeId: string): PayrollEntry[] => {
    return storage.get<PayrollEntry>(STORAGE_KEYS.PAYROLL).filter(p => p.employeeId === employeeId);
  },
  getByPeriod: (month: string, year: number): PayrollEntry[] => {
    return storage.get<PayrollEntry>(STORAGE_KEYS.PAYROLL).filter(p => p.month === month && p.year === year);
  }
};

export const attendanceStorage = {
  getAll: (): AttendanceRecord[] => storage.get<AttendanceRecord>(STORAGE_KEYS.ATTENDANCE),
  getById: (id: string): AttendanceRecord | null => storage.getById<AttendanceRecord>(STORAGE_KEYS.ATTENDANCE, id),
  create: (attendance: AttendanceRecord): void => storage.add(STORAGE_KEYS.ATTENDANCE, attendance),
  update: (id: string, updates: Partial<AttendanceRecord>): void => storage.update(STORAGE_KEYS.ATTENDANCE, id, updates),
  delete: (id: string): void => storage.delete(STORAGE_KEYS.ATTENDANCE, id),
  getByEmployee: (employeeId: string): AttendanceRecord[] => {
    return storage.get<AttendanceRecord>(STORAGE_KEYS.ATTENDANCE).filter(a => a.employeeId === employeeId);
  },
  getByDate: (date: Date): AttendanceRecord[] => {
    const dateStr = date.toISOString().split('T')[0];
    return storage.get<AttendanceRecord>(STORAGE_KEYS.ATTENDANCE).filter(a => 
      new Date(a.date).toISOString().split('T')[0] === dateStr
    );
  }
};

export const leaveStorage = {
  getAll: (): LeaveRequest[] => storage.get<LeaveRequest>(STORAGE_KEYS.LEAVE_REQUESTS),
  getById: (id: string): LeaveRequest | null => storage.getById<LeaveRequest>(STORAGE_KEYS.LEAVE_REQUESTS, id),
  create: (leave: LeaveRequest): void => storage.add(STORAGE_KEYS.LEAVE_REQUESTS, leave),
  update: (id: string, updates: Partial<LeaveRequest>): void => storage.update(STORAGE_KEYS.LEAVE_REQUESTS, id, updates),
  delete: (id: string): void => storage.delete(STORAGE_KEYS.LEAVE_REQUESTS, id),
  getByEmployee: (employeeId: string): LeaveRequest[] => {
    return storage.get<LeaveRequest>(STORAGE_KEYS.LEAVE_REQUESTS).filter(l => l.employeeId === employeeId);
  },
  getPendingRequests: (): LeaveRequest[] => {
    return storage.get<LeaveRequest>(STORAGE_KEYS.LEAVE_REQUESTS).filter(l => l.status === 'pending');
  }
};

export const userStorage = {
  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    try {
      const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },
  setCurrentUser: (user: User): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  },
  logout: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

// Utility Functions
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatDate = (date: Date | string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Seed Data Function
export const seedSampleData = (): void => {
  // Only seed if no data exists
  if (clientStorage.getAll().length === 0) {
    // Sample clients, employees, etc. will be added here
    console.log('Seeding sample data...');
  }
};