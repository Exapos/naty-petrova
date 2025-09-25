'use client';
import { usePathname } from 'next/navigation';
import AdminLayout from './AdminLayout';

interface AdminLayoutWrapperProps {
  children: React.ReactNode;
}

export default function AdminLayoutWrapper({ children }: AdminLayoutWrapperProps) {
  const pathname = usePathname();
  
  // Pro login stránku (/admin) nepoužívej AdminLayout
  if (pathname === '/admin') {
    return <>{children}</>;
  }
  
  // Pro ostatní admin stránky použij AdminLayout
  return <AdminLayout>{children}</AdminLayout>;
}