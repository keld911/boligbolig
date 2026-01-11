'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Home, MapPin, Bed, Calendar, Zap, ArrowLeft, Mail } from 'lucide-react';
import { trpc } from '@/lib/trpc/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PriceSlider } from '@/components/properties/price-slider';
import { PROPERTY_TYPE_LABELS } from '@/types/database';

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;

  const { data: property, isLoading } = trpc.property.byId.useQuery(propertyId);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('da-DK', {
      style: 'currency',
      currency: 'DKK',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link href="/" className="flex items-center">
                <Home className="h-8 w-8 text-primary-600" />
                <span className="ml-2 text-2xl font-bold text-gray-900">Boligbolig</span>
              </Link>
            </div>
          </div>
        </nav>
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Henter boligoplysninger...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link href="/" className="flex items-center">
                <Home className="h-8 w-8 text-primary-600" />
                <span className="ml-2 text-2xl font-bold text-gray-900">Boligbolig</span>
              </Link>
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Bolig ikke fundet</h1>
            <p className="mt-2 text-gray-600">Denne bolig eksisterer ikke eller er blevet slettet.</p>
            <Link href="/koeb" className="mt-4 inline-block">
              <Button>Tilbage til oversigten</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/koeb" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Tilbage til oversigten
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <Card>
              <div className="h-96 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <Home className="h-32 w-32 text-blue-300" />
              </div>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {PROPERTY_TYPE_LABELS[property.property_type]}
                    </h1>
                    <p className="text-lg text-gray-600 flex items-center mt-2">
                      <MapPin className="h-5 w-5 mr-2" />
                      {property.is_anonymous ? property.region?.name : property.address_city}
                    </p>
                    {!property.is_anonymous && property.address_street && (
                      <p className="text-gray-600 ml-7">{property.address_street}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary-600">
                      {formatPrice(property.asking_price)}
                    </p>
                    {property.is_anonymous && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                        Anonym skuffesag
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Boligoplysninger</h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Home className="h-8 w-8 mx-auto text-primary-600 mb-2" />
                    <p className="text-sm text-gray-500">Boligareal</p>
                    <p className="text-lg font-semibold">{property.sqm_living} m²</p>
                  </div>
                  {property.sqm_lot && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Home className="h-8 w-8 mx-auto text-primary-600 mb-2" />
                      <p className="text-sm text-gray-500">Grundareal</p>
                      <p className="text-lg font-semibold">{property.sqm_lot} m²</p>
                    </div>
                  )}
                  {property.rooms && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Bed className="h-8 w-8 mx-auto text-primary-600 mb-2" />
                      <p className="text-sm text-gray-500">Værelser</p>
                      <p className="text-lg font-semibold">{property.rooms}</p>
                    </div>
                  )}
                  {property.build_year && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Calendar className="h-8 w-8 mx-auto text-primary-600 mb-2" />
                      <p className="text-sm text-gray-500">Byggeår</p>
                      <p className="text-lg font-semibold">{property.build_year}</p>
                    </div>
                  )}
                  {property.energy_label && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Zap className="h-8 w-8 mx-auto text-primary-600 mb-2" />
                      <p className="text-sm text-gray-500">Energimærke</p>
                      <p className="text-lg font-semibold">{property.energy_label}</p>
                    </div>
                  )}
                </div>

                {property.features && property.features.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold mb-3">Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {property.features.map((feature) => (
                        <span
                          key={feature.feature_key}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                        >
                          {feature.feature_key}: {feature.feature_value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Beskrivelse</h2>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Dette er en {PROPERTY_TYPE_LABELS[property.property_type].toLowerCase()} på{' '}
                  {property.sqm_living} m² beliggende i {property.region?.name}.
                  {property.rooms && ` Boligen har ${property.rooms} værelser`}
                  {property.build_year && ` og blev bygget i ${property.build_year}`}.
                  {property.energy_label &&
                    ` Energimærket er ${property.energy_label}, hvilket sikrer god energieffektivitet.`}
                </p>
                {property.is_anonymous && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Anonym sag:</strong> Den nøjagtige adresse bliver først oplyst når
                      både køber og sælger har accepteret et match. Dette sikrer sælgers anonymitet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Vis interesse</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Opret en køberprofil for at se om du matcher med denne bolig
                </p>
                <Link href="/koeber/ny">
                  <Button className="w-full" size="lg">
                    <Mail className="h-5 w-5 mr-2" />
                    Opret køberprofil
                  </Button>
                </Link>
                <p className="text-xs text-gray-500 text-center">
                  Dine oplysninger deles ikke med sælger før I begge har accepteret matchet
                </p>
              </CardContent>
            </Card>

            {/* Price Analysis */}
            <PriceSlider
              regionId={property.region_id}
              propertyType={property.property_type}
              initialPrice={property.asking_price}
              minPrice={Math.floor(property.asking_price * 0.7)}
              maxPrice={Math.ceil(property.asking_price * 1.3)}
            />

            {/* Location Info */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Område</h2>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold mb-2">{property.region?.name}</p>
                {property.region?.avg_sqm_price && (
                  <p className="text-sm text-gray-600">
                    Gennemsnitlig m² pris i området:{' '}
                    {formatPrice(property.region.avg_sqm_price)}/m²
                  </p>
                )}
                <div className="mt-4 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                  <MapPin className="h-12 w-12 text-gray-400" />
                  <p className="ml-2 text-gray-500">Kort kommer snart</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
