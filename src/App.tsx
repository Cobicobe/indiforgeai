import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { WalletContextProvider } from './contexts/WalletContext';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { Marketplace } from './components/Marketplace';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <LandingPage onNavigate={setCurrentPage} />;
      case 'marketplace':
        return <Marketplace />;
      case 'upload':
        return (
          <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Upload Dataset</h1>
              <p className="text-gray-600">Coming soon! Upload functionality will be available shortly.</p>
            </div>
          </div>
        );
      case 'my-datasets':
        return (
          <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">My Datasets</h1>
              <p className="text-gray-600">Coming soon! View your purchased and uploaded datasets here.</p>
            </div>
          </div>
        );
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <WalletContextProvider>
      <div className="App">
        <Header currentPage={currentPage} onNavigate={setCurrentPage} />
        {renderPage()}
        <Toaster position="top-right" />
      </div>
    </WalletContextProvider>
  );
}

export default App;