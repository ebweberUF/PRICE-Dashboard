export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  PRICE Dashboard
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  University of Florida
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                Development
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Logo/Icon */}
          <div className="mx-auto w-24 h-24 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg">
            <span className="text-white font-bold text-4xl">PRICE</span>
          </div>

          {/* Title */}
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Pain Research and Intervention
            <br />
            Center of Excellence
          </h2>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            HIPAA-Compliant Research Data Management Dashboard
          </p>

          {/* Status Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-lg mx-auto mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse mr-2"></div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                System Status: Under Development
              </span>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Coming Soon
              </h3>
              <ul className="text-left text-gray-600 dark:text-gray-400 space-y-2">
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span>UF Shibboleth SSO Authentication</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span>Lab &amp; Study Management</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span>Participant Tracking (Coded IDs)</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span>REDCap, eLab, SharePoint Integration</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span>Data Completeness Dashboard</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Enter Dashboard Button */}
          <a
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors mb-6"
          >
            Enter Dashboard
            <ArrowIcon className="w-5 h-5 ml-2" />
          </a>

          {/* Security Badge */}
          <div className="inline-flex items-center space-x-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full">
            <ShieldIcon className="w-5 h-5" />
            <span className="text-sm font-medium">
              Limited Data Set - HIPAA Compliant
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <p>UF PRICE Center - College of Dentistry</p>
            <p>UF Intranet Access Only</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 7l5 5m0 0l-5 5m5-5H6"
      />
    </svg>
  );
}
