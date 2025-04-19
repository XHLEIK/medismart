import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { VoiceAIProvider } from './context/VoiceAIContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <VoiceAIProvider>
          <App />
        </VoiceAIProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
