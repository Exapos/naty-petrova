'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PhotoIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { Reference } from '@/types/reference';
import { canAccessReferences } from '@/lib/permissions';

export default function ReferenceManagementPage() {
  const { data: session, status } = useSession();
  const [references, setReferences] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Kontrola oprávnění
  useEffect(() => {
    if (status === 'loading') return;
    if (!session || !canAccessReferences(session.user?.role || '')) {
      router.push('/admin/dashboard');
      return;
    }
    fetchReferences();
  }, [session, status, router]);

  const fetchReferences = async () => {
    try {
      const response = await fetch('/api/references');
      if (!response.ok) {
        throw new Error('Failed to fetch references');
      }
      const data = await response.json();
      setReferences(data);
    } catch (err) {
      setError('Chyba při načítání referencí');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Opravdu chcete smazat tuto referenci?')) {
      return;
    }

    try {
      const response = await fetch(`/api/references/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete reference');
      }

      // Refresh list
      fetchReferences();
    } catch (err) {
      console.error('Error deleting reference:', err);
      setError('Chyba při mazání reference');
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/references/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          published: !currentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update reference');
      }

      fetchReferences();
    } catch (err) {
      console.error('Error updating reference:', err);
      setError('Chyba při aktualizaci reference');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Načítání referencí...</p>
        </div>
      </div>
    );
  }

  if (!session || !canAccessReferences(session.user?.role || '')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold leading-tight text-gray-900">
                Správa referencí
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                Spravujte portfolio projektů a referencí
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={() => router.push('/admin/reference/new')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Nová reference
              </button>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
            <button 
              onClick={() => setError(null)}
              className="float-right text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </div>
        )}

        {/* References Grid */}
        {references.length === 0 ? (
          <div className="text-center py-12">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Žádné reference</h3>
            <p className="mt-1 text-sm text-gray-500">Začněte vytvořením první reference.</p>
            <div className="mt-6">
              <button
                onClick={() => router.push('/admin/reference/new')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Nová reference
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {references.map((reference) => (
              <div
                key={reference.id}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  {reference.image ? (
                    <Image
                      src={reference.image}
                      alt={reference.title}
                      width={400}
                      height={192}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <PhotoIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      reference.published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {reference.published ? 'Publikováno' : 'Nepublikováno'}
                    </span>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {reference.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {reference.title}
                  </h3>

                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {reference.location}
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {reference.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(reference.createdAt).toLocaleDateString('cs-CZ')}
                    </span>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => togglePublished(reference.id, reference.published)}
                        className={`p-2 rounded-full ${
                          reference.published 
                            ? 'text-green-600 hover:bg-green-100' 
                            : 'text-gray-400 hover:bg-gray-100'
                        }`}
                        title={reference.published ? 'Skrýt' : 'Publikovat'}
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => router.push(`/admin/reference/edit/${reference.id}`)}
                        className="p-2 text-blue-600 rounded-full hover:bg-blue-100"
                        title="Upravit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(reference.id)}
                        className="p-2 text-red-600 rounded-full hover:bg-red-100"
                        title="Smazat"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}