'use client';

import Link from 'next/link';
import { Home, Users, ArrowRight, CheckCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PROPERTY_TYPE_LABELS } from '@/types/database';

// Mock ring match data
const mockRingMatches = [
  {
    id: 'ring-1',
    ring_size: 3,
    total_value: 14500000,
    feasibility_score: 0.87,
    status: 'proposed',
    participants: [
      {
        position: 0,
        user_name: 'Lars Nielsen',
        user_email: 'lars@example.dk',
        selling_property: {
          id: 'prop-1',
          type: 'lejlighed',
          address: 'København K',
          price: 4500000,
          sqm: 85,
        },
        buying_property: {
          id: 'prop-2',
          type: 'villa',
          address: 'Nordsjælland',
          price: 6800000,
          sqm: 150,
        },
        has_accepted: false,
      },
      {
        position: 1,
        user_name: 'Marie Hansen',
        user_email: 'marie@example.dk',
        selling_property: {
          id: 'prop-2',
          type: 'villa',
          address: 'Nordsjælland',
          price: 6800000,
          sqm: 150,
        },
        buying_property: {
          id: 'prop-3',
          type: 'raekkehus',
          address: 'Aarhus',
          price: 3200000,
          sqm: 120,
        },
        has_accepted: false,
      },
      {
        position: 2,
        user_name: 'Peter Andersen',
        user_email: 'peter@example.dk',
        selling_property: {
          id: 'prop-3',
          type: 'raekkehus',
          address: 'Aarhus',
          price: 3200000,
          sqm: 120,
        },
        buying_property: {
          id: 'prop-1',
          type: 'lejlighed',
          address: 'København K',
          price: 4500000,
          sqm: 85,
        },
        has_accepted: true,
      },
    ],
  },
];

export default function RingMatchesPage() {
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
                href="/koeb"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Køb
              </Link>
              <Link
                href="/saelg"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Sælg
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="h-8 w-8 mr-3 text-primary-600" />
            Ring-Matches: Cirkulære Bolighandler
          </h1>
          <p className="mt-2 text-gray-600">
            Flere parter kan bytte boliger samtidigt i en cirkulær kæde
          </p>
        </div>

        {/* Explanation Card */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="py-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              💡 Hvordan fungerer ring-matches?
            </h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <strong>Ring-matching</strong> er en unik funktion der gør det muligt for flere
                parter at handle boliger samtidigt:
              </p>
              <ul className="list-disc ml-5 space-y-1">
                <li>
                  <strong>Person A</strong> sælger til <strong>Person B</strong>
                </li>
                <li>
                  <strong>Person B</strong> sælger til <strong>Person C</strong>
                </li>
                <li>
                  <strong>Person C</strong> sælger til <strong>Person A</strong>
                </li>
              </ul>
              <p className="mt-3">
                Når alle parter accepterer, kan alle handlene gennemføres samtidigt! Dette løser
                problemet med at skulle sælge før man kan købe.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Ring Matches */}
        {mockRingMatches.length > 0 ? (
          <div className="space-y-8">
            {mockRingMatches.map((ring) => (
              <Card key={ring.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold flex items-center">
                        <Users className="h-6 w-6 mr-2" />
                        {ring.ring_size}-Parts Ring Match
                      </h2>
                      <p className="mt-1 opacity-90">
                        Samlet handelsværdi: {formatPrice(ring.total_value)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">
                        {Math.round(ring.feasibility_score * 100)}%
                      </div>
                      <p className="text-sm opacity-90">Gennemførbarhed</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {/* Ring Visualization */}
                  <div className="relative">
                    {ring.participants.map((participant, index) => {
                      const isLast = index === ring.participants.length - 1;
                      const nextParticipant = isLast
                        ? ring.participants[0]
                        : ring.participants[index + 1];

                      return (
                        <div key={participant.position}>
                          {/* Participant Card */}
                          <Card
                            className={`mb-6 ${
                              participant.has_accepted
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-300'
                            }`}
                          >
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center mb-3">
                                    <div className="bg-primary-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold mr-3">
                                      {participant.position + 1}
                                    </div>
                                    <div>
                                      <h3 className="font-bold text-gray-900">
                                        {participant.user_name}
                                      </h3>
                                      <p className="text-sm text-gray-600">
                                        {participant.user_email}
                                      </p>
                                    </div>
                                    {participant.has_accepted && (
                                      <CheckCircle className="h-6 w-6 text-green-600 ml-3" />
                                    )}
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    {/* Selling */}
                                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                                      <p className="text-xs text-red-600 font-semibold mb-2">
                                        SÆLGER
                                      </p>
                                      <p className="font-semibold text-gray-900">
                                        {PROPERTY_TYPE_LABELS[participant.selling_property.type as keyof typeof PROPERTY_TYPE_LABELS]}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {participant.selling_property.address}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {participant.selling_property.sqm} m²
                                      </p>
                                      <p className="font-bold text-red-600 mt-2">
                                        {formatPrice(participant.selling_property.price)}
                                      </p>
                                    </div>

                                    {/* Buying */}
                                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                      <p className="text-xs text-green-600 font-semibold mb-2">
                                        KØBER
                                      </p>
                                      <p className="font-semibold text-gray-900">
                                        {PROPERTY_TYPE_LABELS[participant.buying_property.type as keyof typeof PROPERTY_TYPE_LABELS]}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {participant.buying_property.address}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {participant.buying_property.sqm} m²
                                      </p>
                                      <p className="font-bold text-green-600 mt-2">
                                        {formatPrice(participant.buying_property.price)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Arrow to next participant */}
                          {!isLast || ring.participants.length > 2 ? (
                            <div className="flex items-center justify-center -my-3 z-10 relative">
                              <div className="bg-white px-4 py-2 rounded-full border-2 border-primary-600 shadow-md flex items-center">
                                <ArrowRight className="h-5 w-5 text-primary-600 mr-2" />
                                <span className="text-sm font-medium text-primary-600">
                                  {isLast
                                    ? 'Tilbage til start (ringen lukkes)'
                                    : `Til ${nextParticipant.user_name}`}
                                </span>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex justify-between items-center pt-6 border-t border-gray-200">
                    <div>
                      <p className="text-sm text-gray-600">
                        {ring.participants.filter((p) => p.has_accepted).length} af{' '}
                        {ring.participants.length} har accepteret
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <Button variant="outline">Se detaljer</Button>
                      <Button>Accepter ring-match</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ingen ring-matches endnu
              </h3>
              <p className="text-gray-600 mb-6">
                Vores algoritme arbejder konstant på at finde cirkulære matches mellem
                brugere. Når der er nok data, vil potentielle ring-matches vises her.
              </p>
              <Link href="/saelg/ny">
                <Button>Opret boligannonce</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* How it works */}
        <Card className="mt-8">
          <CardHeader>
            <h2 className="text-xl font-semibold">Sådan fungerer processen</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-primary-100 text-primary-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mx-auto mb-3">
                  1
                </div>
                <h3 className="font-semibold mb-2">Algoritmen finder matches</h3>
                <p className="text-sm text-gray-600">
                  Systemet identificerer cirkulære handelsmuligheder
                </p>
              </div>

              <div className="text-center">
                <div className="bg-primary-100 text-primary-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mx-auto mb-3">
                  2
                </div>
                <h3 className="font-semibold mb-2">Du gennemgår forslaget</h3>
                <p className="text-sm text-gray-600">
                  Se hvilke boliger og parter der er involveret
                </p>
              </div>

              <div className="text-center">
                <div className="bg-primary-100 text-primary-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mx-auto mb-3">
                  3
                </div>
                <h3 className="font-semibold mb-2">Alle parter accepterer</h3>
                <p className="text-sm text-gray-600">
                  Når alle har sagt ja, kan handlen gennemføres
                </p>
              </div>

              <div className="text-center">
                <div className="bg-primary-100 text-primary-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mx-auto mb-3">
                  4
                </div>
                <h3 className="font-semibold mb-2">Koordineret gennemførelse</h3>
                <p className="text-sm text-gray-600">
                  Alle handler gennemføres samtidigt med juridisk bistand
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
