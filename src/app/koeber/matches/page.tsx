'use client';

import Link from 'next/link';
import { Home, TrendingUp, Heart } from 'lucide-react';
import { trpc } from '@/lib/trpc/client';
import { PropertyCard } from '@/components/properties/property-card';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function KoeberMatchesPage() {
  // In real app, get buyer ID from authenticated user
  const buyerId = 'buyer-1';

  const { data: buyerProfile } = trpc.buyer.byId.useQuery(buyerId);
  const { data: matchingProperties, isLoading } = trpc.buyer.getMatches.useQuery(buyerId);
  const { data: directMatches } = trpc.match.forBuyer.useQuery(buyerId);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('da-DK', {
      style: 'currency',
      currency: 'DKK',
      minimumFractionDigits: 0,
    }).format(price);
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
                href="/koeber/matches"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md"
              >
                Mine matches
              </Link>
              <Link
                href="/koeb"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Browse alle
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dine matches</h1>
          <p className="mt-2 text-gray-600">
            Boliger der matcher din søgeprofil
          </p>
        </div>

        {buyerProfile && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Din køberprofil</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Vi matcher dig med boliger baseret på disse kriterier
                  </p>
                </div>
                <Link href="/koeber/ny">
                  <Button variant="outline" size="sm">
                    Rediger profil
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Budget</p>
                  <p className="font-semibold mt-1">
                    {formatPrice(buyerProfile.budget_min || 0)} -{' '}
                    {formatPrice(buyerProfile.budget_max * (1 + buyerProfile.budget_flexibility))}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    +{Math.round(buyerProfile.budget_flexibility * 100)}% fleksibilitet
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Minimum størrelse</p>
                  <p className="font-semibold mt-1">
                    {buyerProfile.sqm_min || 0} m²
                    {buyerProfile.sqm_max && ` - ${buyerProfile.sqm_max} m²`}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Minimum værelser</p>
                  <p className="font-semibold mt-1">{buyerProfile.rooms_min || 'Ingen krav'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Matches */}
        {directMatches && directMatches.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Heart className="h-6 w-6 text-red-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">
                Aktive matches ({directMatches.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {directMatches.map((match) =>
                match.property ? (
                  <div key={match.id} className="relative">
                    <div className="absolute top-4 right-4 z-10">
                      <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        {Math.round(match.match_score * 100)}% match
                      </div>
                    </div>
                    <PropertyCard property={match.property} />
                  </div>
                ) : null
              )}
            </div>
          </div>
        )}

        {/* Potential Matches */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Potentielle matches
            {matchingProperties && matchingProperties.length > 0 && (
              <span className="text-gray-500 text-lg ml-2">
                ({matchingProperties.length})
              </span>
            )}
          </h2>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Finder matches...</p>
            </div>
          ) : matchingProperties && matchingProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchingProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Home className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ingen matches endnu
                </h3>
                <p className="text-gray-600 mb-6">
                  Vi kunne ikke finde nogle boliger der matcher dine kriterier lige nu.
                  <br />
                  Prøv at justere din søgeprofil for at se flere resultater.
                </p>
                <Link href="/koeber/ny">
                  <Button>Rediger søgeprofil</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Info Box */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="py-6">
            <h3 className="font-semibold text-gray-900 mb-2">💡 Sådan fungerer matching</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                • Vi matcher dig automatisk med boliger der passer til dine kriterier
              </li>
              <li>
                • Match-scoren viser hvor godt en bolig matcher dine ønsker (høj score = bedre match)
              </li>
              <li>
                • Du kan se anonyme skuffesager før de kommer på markedet
              </li>
              <li>
                • Når du viser interesse, får sælger besked hvis de også er interesserede
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
