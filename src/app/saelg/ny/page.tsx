'use client';

import { useState } from 'react';
import { Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PriceSlider } from '@/components/properties/price-slider';
import { trpc } from '@/lib/trpc/client';
import { PropertyType, PROPERTY_TYPE_LABELS } from '@/types/database';

export default function NyBoligPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    regionId: 1,
    propertyType: PropertyType.LEJLIGHED,
    sqmLiving: 85,
    rooms: 3,
    buildYear: 2015,
    energyLabel: 'A',
    askingPrice: 3000000,
  });

  const { data: regions } = trpc.property.regions.useQuery();

  const handleSubmit = () => {
    console.log('Submitting property:', formData);
    // TODO: Submit to API
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
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Opret boligannonce</h1>
          <p className="mt-2 text-gray-600">Udfyld informationer om din bolig</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    step >= s ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${step > s ? 'bg-primary-600' : 'bg-gray-300'}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Grunddata</span>
            <span>Prissætning</span>
            <span>Billeder</span>
          </div>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Grundlæggende oplysninger</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Boligtype
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  value={formData.propertyType}
                  onChange={(e) =>
                    setFormData({ ...formData, propertyType: e.target.value as PropertyType })
                  }
                >
                  {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  value={formData.regionId}
                  onChange={(e) => setFormData({ ...formData, regionId: Number(e.target.value) })}
                >
                  {regions?.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Boligareal (m²)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    value={formData.sqmLiving}
                    onChange={(e) =>
                      setFormData({ ...formData, sqmLiving: Number(e.target.value) })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Antal værelser
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    value={formData.rooms}
                    onChange={(e) => setFormData({ ...formData, rooms: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Byggeår
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    value={formData.buildYear}
                    onChange={(e) =>
                      setFormData({ ...formData, buildYear: Number(e.target.value) })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Energimærke
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    value={formData.energyLabel}
                    onChange={(e) => setFormData({ ...formData, energyLabel: e.target.value })}
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                    <option value="G">G</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button onClick={() => setStep(2)}>Næste</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Pricing */}
        {step === 2 && (
          <div className="space-y-6">
            <PriceSlider
              regionId={formData.regionId}
              propertyType={formData.propertyType}
              initialPrice={formData.askingPrice}
              onPriceChange={(price) => setFormData({ ...formData, askingPrice: price })}
            />

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Tilbage
              </Button>
              <Button onClick={() => setStep(3)}>Næste</Button>
            </div>
          </div>
        )}

        {/* Step 3: Images */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Billeder</h2>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <p className="text-gray-500">Billedupload kommer snart...</p>
                <p className="text-sm text-gray-400 mt-2">
                  Her kan du uploade billeder af din bolig
                </p>
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Tilbage
                </Button>
                <Button onClick={handleSubmit}>Opret annonce</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
