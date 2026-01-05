
import React, { useState } from 'react';
import './App.css';
import FileUploader from './components/FileUploader';
import Dashboard from './components/Dashboard';
import WhatsAppLogo from './components/WhatsAppLogo';
import { RefreshCw } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import PerformanceMonitor from './components/common/PerformanceMonitor';

function App() {
  const [messages, setMessages] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDataLoaded = (data, name) => {
    setMessages(data);
    setFileName(name);
    setLoading(false);
  };

  const handleReset = () => {
    setMessages(null);
    setFileName('');
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
      <header>
        <div className="logo-section">
          <WhatsAppLogo size={52} color="#25D366" />
          <h1>Whatsapp Chat Insights</h1>
        </div>
        <p className="subtitle">Visualiza tu historial de chat de WhatsApp de forma segura en tu navegador</p>
      </header>

      <main>
        {loading && (
          <div className="loading-state">
            <RefreshCw className="spin" size={32} />
            <p>Procesando archivo de chat...</p>
          </div>
        )}

        {!messages && !loading && (
          <FileUploader onDataLoaded={handleDataLoaded} onLoading={setLoading} />
        )}

        {messages && !loading && (
          <>
            <div className="toolbar">
              <button onClick={handleReset} className="btn-secondary">Analizar otro archivo</button>
            </div>
            <Dashboard messages={messages} fileName={fileName} />
          </>
        )}
      </main>

      {/* Performance Monitor - Solo visible en desarrollo */}
      {import.meta.env.DEV && <PerformanceMonitor />}
    </div>
  );
}

export default App;
