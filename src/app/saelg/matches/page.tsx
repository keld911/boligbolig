'use client';

import Link from 'next/link';
import { Home, Users, TrendingUp, MapPin, Mail } from 'lucide-react';
import { trpc } from '@/lib/trpc/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PROPERTY_TYPE_LABELS } from '@/types/database';

export default function SaelgerMatchesPage() {
  // In real app, get user ID from authenticated user and fetch their properties
  const userId = 'user-1';

  const { data: myProperties } = trpc.property.list.useQuery({});
  const userProperties = myProperties?.filter((p) => p.owner_id === userId);

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
                href="/saelg/matches"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md"
              >
                Mine boliger
              </Link>
              <Link
                href="/saelg/ny"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Ny bolig
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mine boliger</h1>
          <p className="mt-2 text-gray-600">
            Oversigt over dine annoncer og potentielle købere
          </p>
        </div>

        {!userProperties || userProperties.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Home className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ingen boliger endnu
              </h3>
              <p className="text-gray-600 mb-6">
                Du har ikke oprettet nogen boligannoncer endnu.
                <br />
                Kom i gang med at oprette din første bolig.
              </p>
              <Link href="/saelg/ny">
                <Button>Opret bolig</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {userProperties.map((property) => {
              // Get matches for this property
              const propertyMatches = trpc.match.forProperty.useQuery(property.id);
              const matchCount = propertyMatches.data?.length || 0;

              // Get buyer count for this property
              const buyerCountData = trpc.property.getBuyerCount.useQuery({
                regionId: property.region_id,
                propertyType: property.property_type,
                price: property.asking_price,
              });

              const interestedBuyers = buyerCountData.data?.count || 0;

              return (
                <Card key={property.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold text-gray-900">
                            {PROPERTY_TYPE_LABELS[property.property_type]}
                          </h2>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              property.status === 'aktiv'
                                ? 'bg-green-100 text-green-800'
                                : property.status === 'skuffe'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {property.status === 'aktiv'
                              ? 'Aktiv'
                              : property.status === 'skuffe'
                              ? 'Skuffesag'
                              : property.status}
                          </span>
                        </div>
                        <p className="text-gray-600 flex items-center mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {property.region?.name}
                        </p>
                        <p className="text-2xl font-bold text-primary-600 mt-2">
                          {formatPrice(property.asking_price)}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Users className="h-8 w-8 mx-auto text-primary-600 mb-2" />
                        <p className="text-2xl font-bold text-gray-900">{matchCount}</p>
                        <p className="text-sm text-gray-600">Matches</p>
                      </div>

                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <TrendingUp className="h-8 w-8 mx-auto text-primary-600 mb-2" />
                        <p className="text-2xl font-bold text-gray-900">{interestedBuyers}</p>
                        <p className="text-sm text-gray-600">Interesserede købere</p>
                      </div>

                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Home className="h-8 w-8 mx-auto text-primary-600 mb-2" />
                        <p className="text-2xl font-bold text-gray-900">{property.sqm_living}</p>
                        <p className="text-sm text-gray-600">m² boligareal</p>
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-200">
                      <div>
                        <p className="text-sm text-gray-500">Værelser</p>
                        <p className="font-semibold">{property.rooms || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Byggeår</p>
                        <p className="font-semibold">{property.build_year || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Energimærke</p>
                        <p className="font-semibold">{property.energy_label || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Grundareal</p>
                        <p className="font-semibold">
                          {property.sqm_lot ? `${property.sqm_lot} m²` : 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Matches Section */}
                    {matchCount > 0 ? (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <Users className="h-5 w-5 mr-2 text-primary-600" />
                          Potentielle købere ({matchCount})
                        </h3>
                        <div className="space-y-3">
                          {propertyMatches.data?.slice(0, 3).map((match) => (
                            <div
                              key={match.id}
                              className="flex items-center justify-between p-4 bg-blue-50 rounded-lg"
                            >
                              <div className="flex-1">
                                <div className="flex items-center">
                                  <div className="bg-primary-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold mr-3">
                                    {match.buyer_profile?.user?.email?.[0].toUpperCase() || 'K'}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-900">
                                      Anonym køber
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Match score: {Math.round(match.match_score * 100)}%
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                  {match.status === 'pending' && 'Ny'}
                                  {match.status === 'viewed' && 'Set'}
                                  {match.status === 'interested' && 'Interesseret'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        {matchCount > 3 && (
                          <p className="text-sm text-gray-600 text-center mt-3">
                            + {matchCount - 3} flere matches
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <Mail className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600 mb-2">Ingen matches endnu</p>
                        <p className="text-sm text-gray-500">
                          Vi informerer dig når der er købere der matcher din bolig
                        </p>
                      </div>
                    )}

                    <div className="flex space-x-3 mt-6">
                      <Link href={`/bolig/${property.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          Se annonce
                        </Button>
                      </Link>
                      <Link href={`/saelg/ny?edit=${property.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          Rediger
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Tips */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="py-6">
            <h3 className="font-semibold text-gray-900 mb-2">💡 Tips til at tiltrække købere</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                • Brug pris-slideren til at finde den optimale pris baseret på efterspørgsel
              </li>
              <li>
                • Skuffesager får ofte flere interesserede købere pga. eksklusivitet
              </li>
              <li>
                • Tilføj gode billeder og detaljerede beskrivelser
              </li>
              <li>
                • Svar hurtigt på interessetilkendegivelser for at lukke handlen
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
