import React from 'react';
import { AppProvider } from './context/AppContext';
import PricingPage from './components/PricingPage';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Blue-Green Pricing Demo
            </h1>
            <p className="text-xl text-blue-100">
              Dynamic pricing deployment with configurable routing
            </p>
          </header>
          <main>
            <PricingPage />
          </main>
        </div>
      </div>
    </AppProvider>
  );
}

export default App;