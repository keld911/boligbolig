'use client';

import { Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function SaelgPage() {
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
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md"
              >
                Sælg
              </Link>
              <Link
                href="/koeb"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Køb
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Sælg din bolig</h1>
          <p className="mt-2 text-gray-600">
            Opret en anonym skuffesag og find den rette køber
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Anonym Skuffesag</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Sælg din bolig uden offentlig annoncering. Kun potentielle købere der matcher dine
                kriterier kan se boligen.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Fuld anonymitet indtil begge parter accepterer</li>
                <li>✓ Intelligent matching med kvalificerede købere</li>
                <li>✓ Se antal interesserede ved forskellige priser</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Offentlig Annonce</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Traditionel annoncering med maksimal synlighed. Velegnet hvis du ønsker bred
                eksponering.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Fuld synlighed på platformen</li>
                <li>✓ Inkluderer alle premium funktioner</li>
                <li>✓ Mulighed for budgivning</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Link href="/saelg/ny">
            <Button size="lg">Opret annonce</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
