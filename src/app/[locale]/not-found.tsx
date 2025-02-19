import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Stránka nebyla nalezena</h1>
      <p className="text-lg mb-8">
        Omlouváme se, ale požadovanou stránku se nám nepodařilo najít.
      </p>
      <Link 
        href="/" 
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
      >
        ← Návrat na úvodní stránku
      </Link>
    </div>
  )
}
