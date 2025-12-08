'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { api, Lab } from '@/lib/api';

export default function LabsPage() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLabs();
  }, []);

  async function loadLabs() {
    try {
      setLoading(true);
      const data = await api.labs.getAll();
      setLabs(data);
      setError(null);
    } catch (err) {
      setError('Failed to load labs. Make sure the backend is running.');
      // Use demo data for now
      setLabs(getDemoLabs());
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Labs"
        subtitle="Manage research laboratories"
        actions={
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            + Add Lab
          </button>
        }
      />

      <div className="flex-1 p-6">
        {error && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {labs.map((lab) => (
              <LabCard key={lab.id} lab={lab} />
            ))}
          </div>
        )}

        {!loading && labs.length === 0 && (
          <div className="text-center py-12">
            <BeakerIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No labs</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new lab.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function LabCard({ lab }: { lab: Lab }) {
  return (
    <Link
      href={`/dashboard/labs/${lab.id}`}
      className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <BeakerIcon className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {lab.labCode}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">{lab.name}</h3>

        {lab.description && (
          <p className="text-sm text-gray-500 mb-4 line-clamp-2">
            {lab.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            {lab.labAdmin ? `Admin: ${lab.labAdmin.displayName || lab.labAdmin.email}` : 'No admin assigned'}
          </span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            lab.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {lab.active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    </Link>
  );
}

function BeakerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
      />
    </svg>
  );
}

// Demo data for when backend is not available
function getDemoLabs(): Lab[] {
  return [
    {
      id: 1,
      labCode: 'PAIN-LAB',
      name: 'Pain Management Lab',
      description: 'Research focused on chronic pain management and intervention strategies.',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      labCode: 'NEURO-LAB',
      name: 'Neuroscience Research Lab',
      description: 'Investigating neurological mechanisms of pain perception.',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 3,
      labCode: 'CLIN-TRIALS',
      name: 'Clinical Trials Unit',
      description: 'Managing multi-site clinical trials for pain interventions.',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}
