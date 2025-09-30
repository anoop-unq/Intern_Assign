import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import PricingCard from './PricingCard';

const PricingPage = () => {
  const { 
    pricingData, 
    loading, 
    error, 
    version, 
    isManualTest,
    testBlueVersion, 
    testGreenVersion, 
    testAutoRouting, 
    clearError 
  } = useContext(AppContext);

  if (loading && !pricingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 bg-gradient-to-br from-gray-900 to-blue-900 rounded-3xl p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-6"></div>
        <p className="text-white text-xl font-medium">Loading pricing data...</p>
        <p className="text-blue-200 mt-2">Fetching the best plans for you</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-500/10 to-red-600/20 border border-red-300 rounded-2xl p-8 text-center max-w-md mx-auto backdrop-blur-sm">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-red-800 text-2xl font-bold mb-3">Error Loading Pricing</h2>
        <p className="text-red-600 mb-6">{error}</p>
        <button 
          onClick={testAutoRouting}
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2 mx-auto"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Version Info & Controls */}
      <div className="bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-green-600/20 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-2xl">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className={`px-6 py-3 rounded-2xl text-white font-bold text-sm shadow-lg flex items-center gap-2 ${
              version === 'blue' 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                : version === 'green' 
                ? 'bg-gradient-to-r from-green-500 to-green-600' 
                : 'bg-gradient-to-r from-gray-500 to-gray-600'
            }`}>
              {isManualTest ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              )}
              {isManualTest ? '🧪 TESTING: ' : 'Serving: '}
              {version ? version.toUpperCase() : 'Unknown'} Version
            </div>
            {isManualTest && (
              <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm font-medium border border-yellow-500/30">
                Manual Test Mode
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center">
            <button 
              onClick={testBlueVersion}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2 group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Test Blue</span>
            </button>
            <button 
              onClick={testGreenVersion}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2 group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Test Green</span>
            </button>
            <button 
              onClick={testAutoRouting}
              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2 group"
            >
              <svg className="w-5 h-5 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Auto Routing</span>
            </button>
          </div>
        </div>
        
        {/* Instructions */}
        <div className="mt-6 p-4 bg-white/10 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3 text-blue-100 text-sm">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold">
                <span className="text-yellow-300">Manual Testing:</span> Buttons force specific versions • 
                <span className="text-green-300"> Auto:</span> Uses {import.meta.ROUTING_STRATEGY || 'percentage'} routing
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      {pricingData && (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-8 lg:p-12 border border-gray-200">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-green-100 text-blue-800 px-6 py-2 rounded-full text-sm font-semibold mb-6 border border-blue-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              Most Popular Plans
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              {pricingData.version.toUpperCase()} Pricing Plans
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Choose the perfect plan that grows with your business needs
            </p>
            <div className={`mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
              version === 'blue' 
                ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                : 'bg-green-100 text-green-800 border border-green-200'
            }`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                version === 'blue' ? 'bg-blue-500' : 'bg-green-500'
              }`}></div>
              Currently viewing: <span className="font-bold">{version}</span> version
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {pricingData.plans.map((plan, index) => (
              <PricingCard key={index} plan={plan} />
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 text-gray-500 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              All plans include secure payment and 30-day money-back guarantee
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingPage;