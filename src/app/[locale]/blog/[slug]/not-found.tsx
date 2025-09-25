import { Link } from '@/i18n/routing';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <ExclamationTriangleIcon className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Článek nenalezen
          </h2>
          <p className="text-gray-600 mb-8">
            Omlouváme se, but článek který hledáte neexistuje nebo byl odstraněn.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/blog"
            className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Zpět na blog
          </Link>
          <Link
            href="/"
            className="block w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Domovská stránka
          </Link>
        </div>
      </div>
    </div>
  );
}