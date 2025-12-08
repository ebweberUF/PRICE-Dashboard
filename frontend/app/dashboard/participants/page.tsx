import { Header } from '@/components/layout';

export default function ParticipantsPage() {
  return (
    <div className="flex flex-col h-full">
      <Header
        title="Participants"
        subtitle="Track study participants (coded IDs only)"
      />

      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UsersIcon className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Participant Tracking Coming Soon
          </h2>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            This module will allow you to view and manage study participants using
            coded subject IDs. All data follows HIPAA Limited Data Set guidelines.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 max-w-lg mx-auto">
            <h3 className="font-medium text-gray-900 mb-3">What will be tracked:</h3>
            <ul className="text-sm text-gray-600 space-y-2 text-left">
              <li className="flex items-center">
                <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                Coded Subject IDs (e.g., PAIN001, CP-042)
              </li>
              <li className="flex items-center">
                <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                Relative dates (days since enrollment)
              </li>
              <li className="flex items-center">
                <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                Age at enrollment (not date of birth)
              </li>
              <li className="flex items-center">
                <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                Visit completion status
              </li>
              <li className="flex items-center">
                <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                Data completeness tracking
              </li>
            </ul>
          </div>

          <div className="mt-6 inline-flex items-center text-sm text-green-600 bg-green-50 px-4 py-2 rounded-full">
            <ShieldIcon className="w-4 h-4 mr-2" />
            HIPAA Limited Data Set Compliant
          </div>
        </div>
      </div>
    </div>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );
}
