import React, { useState } from 'react';

import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import { RefreshCw } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import PerformanceMonitor from './components/common/PerformanceMonitor';
import { generateMockMessages } from './utils/mockData';

function App() {
  const [messages, setMessages] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDataLoaded = (data, name) => {
    setMessages(data);
    setFileName(name);
    setLoading(false);
  };

  const handleLoadDemo = () => {
    setLoading(true);
    setTimeout(() => {
      const mockData = generateMockMessages();
      handleDataLoaded(mockData, 'Chat de Prueba (Demo)');
    }, 800);
  };

  return (
    <div className="app-container">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#202c33',
            color: '#fff',
          }
        }}
      />

      <main>
        {loading && (
          <div className="loading-state">
            <RefreshCw className="spin" size={32} />
            <p>Procesando archivo de chat...</p>
          </div>
        )}

        {!messages && !loading && (
          <>
            <LandingPage onDataLoaded={handleDataLoaded} onLoading={setLoading} />
            {import.meta.env.DEV && (
              <button
                onClick={handleLoadDemo}
                style={{
                  position: 'fixed',
                  bottom: '2rem',
                  right: '2rem',
                  zIndex: 9999,
                  padding: '0.8rem 1.5rem',
                  background: '#00a884',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1rem'
                }}
              >
                🧪 Demo Data
              </button>
            )}
          </>
        )}

        {messages && !loading && (
          <Dashboard messages={messages} fileName={fileName} />
        )}
      </main>

      {import.meta.env.DEV && <PerformanceMonitor />}
    </div>
  );
}

export default App;
