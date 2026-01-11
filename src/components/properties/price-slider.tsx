'use client';

import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc/client';
import { PropertyType } from '@/types/database';
import { TrendingUp, Users } from 'lucide-react';
import clsx from 'clsx';

interface PriceSliderProps {
  regionId: number;
  propertyType: PropertyType;
  initialPrice?: number;
  minPrice?: number;
  maxPrice?: number;
  onPriceChange?: (price: number, buyerCount: number) => void;
}

export function PriceSlider({
  regionId,
  propertyType,
  initialPrice = 3000000,
  minPrice = 1000000,
  maxPrice = 10000000,
  onPriceChange,
}: PriceSliderProps) {
  const [price, setPrice] = useState(initialPrice);
  const [debouncedPrice, setDebouncedPrice] = useState(initialPrice);

  // Debounce the price to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPrice(price);
    }, 300);

    return () => clearTimeout(timer);
  }, [price]);

  const { data: buyerCountData, isLoading } = trpc.property.getBuyerCount.useQuery({
    regionId,
    propertyType,
    price: debouncedPrice,
  });

  const { data: sliderData } = trpc.property.getPriceSliderData.useQuery({
    regionId,
    propertyType,
    minPrice,
    maxPrice,
    steps: 30,
  });

  useEffect(() => {
    if (buyerCountData && onPriceChange) {
      onPriceChange(debouncedPrice, buyerCountData.count);
    }
  }, [debouncedPrice, buyerCountData, onPriceChange]);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('da-DK', {
      style: 'currency',
      currency: 'DKK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const maxBuyerCount = Math.max(...(sliderData?.map((d) => d.buyerCount) ?? [1]));
  const buyerCount = buyerCountData?.count ?? 0;

  // Calculate demand level
  const getDemandLevel = (count: number) => {
    if (count === 0) return { label: 'Ingen interesse', color: 'text-red-600', bg: 'bg-red-100' };
    if (count <= 2)
      return { label: 'Lav efterspørgsel', color: 'text-orange-600', bg: 'bg-orange-100' };
    if (count <= 5)
      return { label: 'Moderat efterspørgsel', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { label: 'Høj efterspørgsel', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const demandLevel = getDemandLevel(buyerCount);

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-primary-600" />
          Prissætning
        </h3>
        <div
          className={clsx(
            'px-3 py-1 rounded-full text-sm font-medium flex items-center',
            demandLevel.bg,
            demandLevel.color
          )}
        >
          <Users className="h-4 w-4 mr-1" />
          {isLoading ? '...' : buyerCount} interesserede
        </div>
      </div>

      {/* Price Display */}
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-2">Udbudspris</p>
        <p className="text-4xl font-bold text-primary-600">{formatPrice(price)}</p>
        <p className="text-sm text-gray-600 mt-2">{demandLevel.label}</p>
      </div>

      {/* Slider */}
      <div className="relative pt-6">
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          step={50000}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>{formatPrice(minPrice)}</span>
          <span>{formatPrice(maxPrice)}</span>
        </div>
      </div>

      {/* Demand Visualization */}
      {sliderData && sliderData.length > 0 && (
        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-3">Efterspørgsel ved forskellige priser</p>
          <div className="h-32 flex items-end space-x-1">
            {sliderData.map((point, index) => {
              const height = maxBuyerCount > 0 ? (point.buyerCount / maxBuyerCount) * 100 : 0;
              const isCurrentPrice = Math.abs(point.price - price) < (maxPrice - minPrice) / 40;

              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center"
                  title={`${formatPrice(point.price)}: ${point.buyerCount} købere`}
                >
                  <div
                    className={clsx(
                      'w-full rounded-t transition-all',
                      isCurrentPrice ? 'bg-primary-600' : 'bg-primary-200 hover:bg-primary-300'
                    )}
                    style={{ height: `${Math.max(height, 2)}%` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="mt-2 text-xs text-gray-500 text-center">
            Flere købere til lavere priser →
          </div>
        </div>
      )}

      {/* Insights */}
      <div className="bg-blue-50 rounded-lg p-4 mt-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">💡 Insights</h4>
        <ul className="space-y-1 text-sm text-gray-700">
          {buyerCount === 0 && (
            <li>• Prisen er for høj - overvej at sænke den for at tiltrække købere</li>
          )}
          {buyerCount > 0 && buyerCount <= 2 && (
            <li>• Der er begrænset interesse - en lavere pris kan øge efterspørgslen</li>
          )}
          {buyerCount > 2 && buyerCount <= 5 && (
            <li>• God balance mellem pris og efterspørgsel</li>
          )}
          {buyerCount > 5 && (
            <>
              <li>• Høj efterspørgsel - du kan måske opnå en højere pris</li>
              <li>• Overvej at starte en budgivning</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
