'use client';

import React from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Reportes y Analytics</h1>
          <div className="mt-8">
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Página en Desarrollo</h3>
              <p className="mt-1 text-sm text-gray-500">
                Los reportes y analytics estarán disponibles próximamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
