'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth/AuthProvider';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  roles?: ('admin' | 'manager' | 'employee')[];
}

const navigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: <div className="w-5 h-5 bg-current rounded"></div>,
  },
  {
    title: 'Clients',
    href: '/clients',
    icon: <div className="w-5 h-5 bg-current rounded-full"></div>,
    roles: ['admin', 'manager'],
  },
  {
    title: 'Invoices',
    href: '/invoices',
    icon: <div className="w-5 h-5 border-2 border-current rounded"></div>,
    roles: ['admin', 'manager'],
  },
  {
    title: 'Employees',
    href: '/employees',
    icon: <div className="w-5 h-5 bg-current rounded-full"></div>,
    roles: ['admin', 'manager'],
  },
  {
    title: 'Payroll',
    href: '/payroll',
    icon: <div className="w-5 h-5 bg-current rounded-sm"></div>,
    roles: ['admin', 'manager'],
  },
  {
    title: 'Attendance',
    href: '/attendance',
    icon: <div className="w-5 h-5 border-2 border-current rounded-full"></div>,
  },
  {
    title: 'Leave Requests',
    href: '/leaves',
    icon: <div className="w-5 h-5 bg-current rounded-lg"></div>,
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: <div className="w-5 h-5 border-2 border-current"></div>,
    roles: ['admin', 'manager'],
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const filteredItems = navigationItems.filter(item => 
    !item.roles || (user && item.roles.includes(user.role))
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo Header */}
          <div className="flex items-center space-x-3 p-6 border-b border-gray-200">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">RM</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Richezza Mega Value</h1>
              <p className="text-xs text-gray-500">Business Suite</p>
            </div>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {filteredItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-200",
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <span className={cn(
                    "transition-colors duration-200",
                    isActive ? "text-blue-600" : "text-gray-400"
                  )}>
                    {item.icon}
                  </span>
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-center">
              <p className="text-xs text-gray-500">© 2024 THE RICHHDAD GROUP</p>
              <p className="text-xs text-gray-400 mt-1">Business Management System</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}