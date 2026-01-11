'use client';

import { useState } from 'react';
import { Home } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { trpc } from '@/lib/trpc/client';
import { PropertyType, PROPERTY_TYPE_LABELS } from '@/types/database';

export default function NyKoeberPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    budgetMin: 2000000,
    budgetMax: 5000000,
    budgetFlexibility: 0.1,
    propertyTypes: [PropertyType.LEJLIGHED] as PropertyType[],
    sqmMin: 70,
    sqmMax: undefined as number | undefined,
    roomsMin: 2,
    buildYearMin: undefined as number | undefined,
    regionIds: [1] as number[],
  });

  const { data: regions } = trpc.property.regions.useQuery();
  const createBuyerMutation = trpc.buyer.create.useMutation();

  const handlePropertyTypeToggle = (type: PropertyType) => {
    setFormData((prev) => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter((t) => t !== type)
        : [...prev.propertyTypes, type],
    }));
  };

  const handleRegionToggle = (regionId: number) => {
    setFormData((prev) => ({
      ...prev,
      regionIds: prev.regionIds.includes(regionId)
        ? prev.regionIds.filter((id) => id !== regionId)
        : [...prev.regionIds, regionId],
    }));
  };

  const handleSubmit = async () => {
    try {
      await createBuyerMutation.mutateAsync({
        userId: 'user-demo', // In real app, get from auth
        ...formData,
      });
      router.push('/koeber/matches');
    } catch (error) {
      console.error('Failed to create buyer profile:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('da-DK', {
      style: 'currency',
      currency: 'DKK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
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
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Opret køberprofil</h1>
          <p className="mt-2 text-gray-600">
            Fortæl os hvad du søger, så matcher vi dig med relevante boliger
          </p>
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
            <span>Budget & Type</span>
            <span>Detaljer</span>
            <span>Områder</span>
          </div>
        </div>

        {/* Step 1: Budget & Property Types */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Budget og boligtype</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Budget Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget (DKK)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Minimum</label>
                    <input
                      type="number"
                      step="100000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      value={formData.budgetMin}
                      onChange={(e) =>
                        setFormData({ ...formData, budgetMin: Number(e.target.value) })
                      }
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formatPrice(formData.budgetMin)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Maksimum</label>
                    <input
                      type="number"
                      step="100000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      value={formData.budgetMax}
                      onChange={(e) =>
                        setFormData({ ...formData, budgetMax: Number(e.target.value) })
                      }
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formatPrice(formData.budgetMax)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Budget Flexibility */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hvor fleksibel er dit budget?
                </label>
                <input
                  type="range"
                  min="0"
                  max="0.3"
                  step="0.05"
                  value={formData.budgetFlexibility}
                  onChange={(e) =>
                    setFormData({ ...formData, budgetFlexibility: Number(e.target.value) })
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Meget stram</span>
                  <span className="font-semibold text-primary-600">
                    +{Math.round(formData.budgetFlexibility * 100)}% over budget
                  </span>
                  <span>Meget fleksibel</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Med {Math.round(formData.budgetFlexibility * 100)}% fleksibilitet accepterer du
                  boliger op til {formatPrice(formData.budgetMax * (1 + formData.budgetFlexibility))}
                </p>
              </div>

              {/* Property Types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Hvilke boligtyper er du interesseret i?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handlePropertyTypeToggle(value as PropertyType)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.propertyTypes.includes(value as PropertyType)
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <p className="font-medium text-center">{label}</p>
                    </button>
                  ))}
                </div>
                {formData.propertyTypes.length === 0 && (
                  <p className="text-sm text-red-600 mt-2">Vælg mindst én boligtype</p>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => setStep(2)}
                  disabled={formData.propertyTypes.length === 0}
                >
                  Næste
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Detaljer om din drømmebolig</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum boligareal (m²)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    value={formData.sqmMin}
                    onChange={(e) => setFormData({ ...formData, sqmMin: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maksimum boligareal (m²) <span className="text-gray-400">(valgfri)</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Ingen grænse"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    value={formData.sqmMax || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sqmMax: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum antal værelser
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    value={formData.roomsMin}
                    onChange={(e) =>
                      setFormData({ ...formData, roomsMin: Number(e.target.value) })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum byggeår <span className="text-gray-400">(valgfri)</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Alle byggeår"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    value={formData.buildYearMin || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        buildYearMin: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Tilbage
                </Button>
                <Button onClick={() => setStep(3)}>Næste</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Regions */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Hvor vil du bo?</h2>
              <p className="text-sm text-gray-600 mt-1">Vælg et eller flere områder</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {regions?.map((region) => (
                  <button
                    key={region.id}
                    type="button"
                    onClick={() => handleRegionToggle(region.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      formData.regionIds.includes(region.id)
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <p className="font-medium">{region.name}</p>
                    {region.avg_sqm_price && (
                      <p className="text-sm text-gray-600 mt-1">
                        Gns. {formatPrice(region.avg_sqm_price)}/m²
                      </p>
                    )}
                  </button>
                ))}
              </div>
              {formData.regionIds.length === 0 && (
                <p className="text-sm text-red-600">Vælg mindst ét område</p>
              )}

              <div className="bg-blue-50 rounded-lg p-4 mt-6">
                <h3 className="font-semibold text-gray-900 mb-2">Din søgeprofil</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>
                    • Budget: {formatPrice(formData.budgetMin)} -{' '}
                    {formatPrice(formData.budgetMax * (1 + formData.budgetFlexibility))}
                  </li>
                  <li>• Boligtyper: {formData.propertyTypes.map(t => PROPERTY_TYPE_LABELS[t]).join(', ')}</li>
                  <li>• Minimum {formData.sqmMin}m², {formData.roomsMin} værelser</li>
                  <li>• Områder: {formData.regionIds.length} valgt</li>
                </ul>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Tilbage
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={formData.regionIds.length === 0 || createBuyerMutation.isLoading}
                >
                  {createBuyerMutation.isLoading ? 'Opretter...' : 'Opret profil'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
