'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { api, Study } from '@/lib/api';

export default function StudiesPage() {
  const [studies, setStudies] = useState<Study[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStudies();
  }, []);

  async function loadStudies() {
    try {
      setLoading(true);
      const data = await api.studies.getAll();
      setStudies(data);
      setError(null);
    } catch (err) {
      setError('Failed to load studies. Make sure the backend is running.');
      // Use demo data for now
      setStudies(getDemoStudies());
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Studies"
        subtitle="Manage clinical research studies"
        actions={
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            + Add Study
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
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Study
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lab
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IRB #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrollment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {studies.map((study) => (
                  <StudyRow key={study.id} study={study} />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && studies.length === 0 && (
          <div className="text-center py-12">
            <ClipboardIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No studies</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new study.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StudyRow({ study }: { study: Study }) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
            <ClipboardIcon className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <Link
              href={`/dashboard/studies/${study.id}`}
              className="text-sm font-medium text-gray-900 hover:text-blue-600"
            >
              {study.name}
            </Link>
            <div className="text-sm text-gray-500">{study.studyCode}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {study.lab?.name || 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {study.irbNumber || 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {study.enrollmentTarget ? `Target: ${study.enrollmentTarget}` : 'No target'}
        </div>
        {study.startYear && (
          <div className="text-sm text-gray-500">
            {study.startYear} - {study.endYear || 'Present'}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            study.active
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {study.active ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Link
          href={`/dashboard/studies/${study.id}`}
          className="text-blue-600 hover:text-blue-900"
        >
          View
        </Link>
      </td>
    </tr>
  );
}

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
      />
    </svg>
  );
}

// Demo data for when backend is not available
function getDemoStudies(): Study[] {
  return [
    {
      id: 1,
      labId: 1,
      lab: { id: 1, labCode: 'PAIN-LAB', name: 'Pain Management Lab', active: true, createdAt: '', updatedAt: '' },
      studyCode: 'CPAIN-001',
      name: 'Chronic Pain Intervention Study',
      description: 'A randomized controlled trial for chronic pain management.',
      irbNumber: 'IRB-2024-001',
      enrollmentTarget: 150,
      startYear: 2024,
      endYear: 2026,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      labId: 1,
      lab: { id: 1, labCode: 'PAIN-LAB', name: 'Pain Management Lab', active: true, createdAt: '', updatedAt: '' },
      studyCode: 'OPIOID-002',
      name: 'Opioid Reduction Protocol',
      description: 'Evaluating non-opioid alternatives for pain management.',
      irbNumber: 'IRB-2024-045',
      enrollmentTarget: 200,
      startYear: 2024,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 3,
      labId: 2,
      lab: { id: 2, labCode: 'NEURO-LAB', name: 'Neuroscience Research Lab', active: true, createdAt: '', updatedAt: '' },
      studyCode: 'NEURO-003',
      name: 'Neural Pathways in Pain Perception',
      description: 'Imaging study of pain processing in the brain.',
      irbNumber: 'IRB-2023-112',
      enrollmentTarget: 75,
      startYear: 2023,
      endYear: 2025,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}
