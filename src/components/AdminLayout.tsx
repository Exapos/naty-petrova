'use client';
import { signOut, useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  PhotoIcon, 
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  UsersIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { canAccessBlogs, canAccessReferences, canAccessAnalytics, canAccessUsers, canAccessSettings, canAccessJobs } from '@/lib/permissions';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const allNavigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon, permission: 'all' },
  { name: 'Blog', href: '/admin/blog', icon: DocumentTextIcon, permission: 'blogs' },
  { name: 'Blog Editor', href: '/admin/blog/editor', icon: DocumentTextIcon, permission: 'blogs' },
  { name: 'Reference', href: '/admin/reference', icon: PhotoIcon, permission: 'references' },
  { name: 'Kariéra', href: '/admin/jobs', icon: BriefcaseIcon, permission: 'jobs' },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon, permission: 'analytics' },
  { name: 'Uživatelé', href: '/admin/users', icon: UsersIcon, permission: 'users' },
  { name: 'Nastavení', href: '/admin/settings', icon: Cog6ToothIcon, permission: 'settings' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status !== 'loading' && !session) {
      router.push('/admin');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
        <span className="ml-2">Načítání...</span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
        <span className="ml-2">Přesměrovávání...</span>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/admin', redirect: true });
  };

  // Filtruj navigaci podle rolí
  const getFilteredNavigation = () => {
    const userRole = session?.user?.role;
    if (!userRole) return [];

    return allNavigation.filter(item => {
      switch (item.permission) {
        case 'all':
          return userRole === 'ADMIN' || userRole === 'EDITOR'; // Dashboard dostupný pro oba
        case 'blogs':
          return canAccessBlogs(userRole);
        case 'references':
          return canAccessReferences(userRole);
        case 'jobs':
          return canAccessJobs(userRole); // Pouze admin
        case 'analytics':
          return canAccessAnalytics(userRole); // Pouze admin
        case 'users':
          return canAccessUsers(userRole); // Pouze admin
        case 'settings':
          return canAccessSettings(userRole); // Oba, ale omezený pro editora
        default:
          return false;
      }
    });
  };

  const navigation = getFilteredNavigation();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform flex flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0`}>
        
        {/* Logo and close button */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* User info */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {session.user?.name ? session.user.name.charAt(0).toUpperCase() : session.user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {session.user?.name || 'Admin'}
              </p>
              <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
              <p className="text-xs text-blue-600 font-medium">
                {session.user?.role === 'ADMIN' ? 'Administrátor' : 'Editor'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-6 px-3 pb-4 overflow-y-auto">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
            
            {/* Sign out button moved here */}
            <div className="pt-4 mt-4 border-t border-gray-200">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                Odhlásit se
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-900"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
        </div>

        {/* Page content */}
        <main className="min-h-screen p-6">
          {children}
        </main>
      </div>
    </div>
  );
}