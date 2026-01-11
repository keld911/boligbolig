'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { PropertyWithDetails } from '@/types/database';
import { PROPERTY_TYPE_LABELS } from '@/types/database';
import { MapPin, Home, Bed } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PropertyCardProps {
  property: PropertyWithDetails;
  isAnonymous?: boolean;
}

export function PropertyCard({ property, isAnonymous = true }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('da-DK', {
      style: 'currency',
      currency: 'DKK',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
        <Home className="h-24 w-24 text-blue-300" />
      </div>

      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {PROPERTY_TYPE_LABELS[property.property_type]}
            </h3>
            <p className="text-sm text-gray-500 flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {isAnonymous ? property.region?.name : property.address_city}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary-600">{formatPrice(property.asking_price)}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Størrelse</p>
            <p className="font-semibold">{property.sqm_living} m²</p>
          </div>
          {property.rooms && (
            <div>
              <p className="text-xs text-gray-500">Værelser</p>
              <p className="font-semibold flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                {property.rooms}
              </p>
            </div>
          )}
          {property.build_year && (
            <div>
              <p className="text-xs text-gray-500">Byggeår</p>
              <p className="font-semibold">{property.build_year}</p>
            </div>
          )}
        </div>

        {property.energy_label && (
          <div className="mt-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Energimærke: {property.energy_label}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button variant="outline" className="w-full">
          Se detaljer
        </Button>
      </CardFooter>
    </Card>
  );
}
