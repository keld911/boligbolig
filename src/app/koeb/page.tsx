'use client';

import { trpc } from '@/lib/trpc/client';
import { PropertyCard } from '@/components/properties/property-card';
import { Home } from 'lucide-react';
import Link from 'next/link';

export default function KoebPage() {
  const { data: properties, isLoading } = trpc.property.list.useQuery({
    status: 'aktiv',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center">
              <Home className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">Boligbolig</span>
            </Link>
            <div className="flex space-x-4">
              <Link
                href="/saelg"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Sælg
              </Link>
              <Link
                href="/koeb"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md"
              >
                Køb
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tilgængelige boliger</h1>
          <p className="mt-2 text-gray-600">
            Browse anonyme skuffesager og aktive annoncer
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Henter boliger...</p>
          </div>
        ) : properties && properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600">Ingen boliger fundet</p>
          </div>
        )}
      </main>
    </div>
  );
}
