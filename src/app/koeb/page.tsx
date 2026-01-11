'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc/client';
import { PropertyCard } from '@/components/properties/property-card';
import { Home, Filter, X } from 'lucide-react';
import Link from 'next/link';
import { PropertyType, PROPERTY_TYPE_LABELS } from '@/types/database';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function KoebPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<{
    regionId?: number;
    propertyType?: PropertyType;
  }>({});

  const { data: properties, isLoading } = trpc.property.list.useQuery({
    status: 'aktiv',
    ...filters,
  });

  const { data: regions } = trpc.property.regions.useQuery();

  const filteredCount = properties?.length || 0;
  const hasActiveFilters = filters.regionId || filters.propertyType;

  const clearFilters = () => {
    setFilters({});
  };

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
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
              >
                Køb
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tilgængelige boliger</h1>
            <p className="mt-2 text-gray-600">
              {filteredCount} {filteredCount === 1 ? 'bolig' : 'boliger'} fundet
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? 'Skjul filtre' : 'Filtre'}
            {hasActiveFilters && (
              <span className="ml-2 bg-primary-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                !
              </span>
            )}
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filtrer boliger</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Ryd filtre
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Region Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Område
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    value={filters.regionId || ''}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        regionId: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                  >
                    <option value="">Alle områder</option>
                    {regions?.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Property Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Boligtype
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    value={filters.propertyType || ''}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        propertyType: e.target.value ? (e.target.value as PropertyType) : undefined,
                      })
                    }
                  >
                    <option value="">Alle typer</option>
                    {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Aktive filtre:</p>
                  <div className="flex flex-wrap gap-2">
                    {filters.regionId && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                        {regions?.find((r) => r.id === filters.regionId)?.name}
                        <button
                          onClick={() => setFilters({ ...filters, regionId: undefined })}
                          className="ml-2 hover:text-primary-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {filters.propertyType && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                        {PROPERTY_TYPE_LABELS[filters.propertyType]}
                        <button
                          onClick={() => setFilters({ ...filters, propertyType: undefined })}
                          className="ml-2 hover:text-primary-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Properties Grid */}
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
          <Card>
            <CardContent className="py-12 text-center">
              <Home className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ingen boliger fundet
              </h3>
              <p className="text-gray-600 mb-6">
                {hasActiveFilters
                  ? 'Prøv at justere dine filtre for at se flere resultater'
                  : 'Der er ingen boliger tilgængelige lige nu'}
              </p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="outline">
                  Ryd alle filtre
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Leder du efter noget specifikt?</h2>
          <p className="mb-6">
            Opret en køberprofil og få automatisk besked når der kommer boliger der matcher dine ønsker
          </p>
          <Link href="/koeber/ny">
            <Button size="lg" variant="secondary">
              Opret køberprofil
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
