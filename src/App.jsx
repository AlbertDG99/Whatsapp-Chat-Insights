import React, { useState, lazy, Suspense } from 'react';

import LandingPage from './components/LandingPage';
import ErrorBoundary from './components/common/ErrorBoundary';
import DashboardSkeleton from './components/common/DashboardSkeleton';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import PerformanceMonitor from './components/common/PerformanceMonitor';
import { generateMockMessages } from './utils/mockData';
import appStyles from './App.module.css';

const Dashboard = lazy(() => import('./components/Dashboard'));

function App() {
  const [messages, setMessages] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDataLoaded = (data, name) => {
    const update = () => {
      setMessages(data);
      setFileName(name);
      setLoading(false);
    };

    // Use View Transitions API with graceful fallback
    if (document.startViewTransition) {
      document.startViewTransition(update);
    } else {
      update();
    }
  };

  const handleReset = () => {
    const update = () => {
      setMessages(null);
      setFileName('');
    };

    if (document.startViewTransition) {
      document.startViewTransition(update);
    } else {
      update();
    }
  };

  const handleLoadDemo = () => {
    setLoading(true);
    setTimeout(() => {
      const mockData = generateMockMessages();
      handleDataLoaded(mockData, 'Chat de Prueba (Demo)');
      toast.success('Datos de demostración cargados');
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

      <ErrorBoundary>
        <main>
          {loading && <DashboardSkeleton />}

          {!messages && !loading && (
            <>
              <LandingPage onDataLoaded={handleDataLoaded} onLoading={setLoading} />
              {import.meta.env.DEV && (
                <button
                  onClick={handleLoadDemo}
                  className={appStyles.demoButton}
                >
                  🧪 Demo Data
                </button>
              )}
            </>
          )}

          {messages && !loading && (
            <Suspense fallback={<DashboardSkeleton />}>
              <Dashboard messages={messages} fileName={fileName} onReset={handleReset} />
            </Suspense>
          )}
        </main>
      </ErrorBoundary>

      {import.meta.env.DEV && <PerformanceMonitor />}
    </div>
  );
}

export default App;
