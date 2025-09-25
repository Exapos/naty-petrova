'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  MapPin,
  Clock,
  Building2,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { JobPosition } from '@/types/career';
import { canAccessJobs } from '@/lib/permissions';

export default function AdminJobsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [positions, setPositions] = useState<JobPosition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user || !canAccessJobs(session.user.role)) {
      router.push('/admin');
      return;
    }

    fetchPositions();
  }, [session, status, router]);

  const fetchPositions = async () => {
    try {
      const response = await fetch('/api/jobs?includeInactive=true');
      const data = await response.json();
      setPositions(data.positions || []);
    } catch (error) {
      console.error('Error fetching positions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getJobTypeLabel = (type: string) => {
    const types = {
      'FULL_TIME': 'Plný úvazek',
      'PART_TIME': 'Částečný úvazek',
      'CONTRACT': 'Smlouva',
      'INTERNSHIP': 'Stáž'
    };
    return types[type as keyof typeof types] || type;
  };

  const togglePositionStatus = async (id: string, currentStatus: boolean) => {
    try {
      const position = positions.find(p => p.id === id);
      if (!position) return;

      const response = await fetch(`/api/jobs/${position.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...position,
          isActive: !currentStatus
        }),
      });

      if (!response.ok) {
        throw new Error('Chyba při aktualizaci pozice');
      }

      await fetchPositions();
    } catch (error) {
      console.error('Error toggling position status:', error);
      alert('Chyba při změně stavu pozice');
    }
  };

  const deletePosition = async (id: string) => {
    if (!confirm('Opravdu chcete smazat tuto pozici?')) return;

    try {
      const position = positions.find(p => p.id === id);
      if (!position) return;

      const response = await fetch(`/api/jobs/${position.slug}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Chyba při mazání pozice');
      }

      await fetchPositions();
    } catch (error) {
      console.error('Error deleting position:', error);
      alert('Chyba při mazání pozice');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Správa pozic
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Spravujte pracovní pozice ve vaší společnosti
              </p>
            </div>
            <Link
              href="/admin/jobs/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nová pozice
            </Link>
          </div>
        </div>

        {/* Positions List */}
        {positions.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Žádné pozice
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Začněte vytvořením nové pracovní pozice.
            </p>
            <div className="mt-6">
              <Link
                href="/admin/jobs/new"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <Plus className="h-5 w-5 mr-2" />
                Nová pozice
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-800 shadow overflow-hidden sm:rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                <thead className="bg-gray-50 dark:bg-zinc-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Pozice
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Detaily
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Vytvořeno
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Akce
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-zinc-700">
                  {positions.map((position) => (
                    <tr key={position.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {position.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {position.department}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <MapPin className="h-4 w-4 mr-1" />
                            {position.location}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <Clock className="h-4 w-4 mr-1" />
                            {getJobTypeLabel(position.type)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => togglePositionStatus(position.id, position.isActive)}
                          className="flex items-center"
                        >
                          {position.isActive ? (
                            <>
                              <ToggleRight className="h-6 w-6 text-green-500 mr-2" />
                              <span className="text-sm text-green-800 dark:text-green-400">
                                Aktivní
                              </span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="h-6 w-6 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Neaktivní
                              </span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(position.createdAt).toLocaleDateString('cs-CZ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/kariera/${position.slug}`}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Zobrazit"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/admin/jobs/edit/${position.id}`}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                            title="Upravit"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => deletePosition(position.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Smazat"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}