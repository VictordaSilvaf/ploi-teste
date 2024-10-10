import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.tsx'
import { EnterpriseProvider } from './context/EnterpriseContext.tsx'
import { EnvironmentProvider } from './context/EnvironmentContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <EnterpriseProvider>
        <EnvironmentProvider>
          <App />
        </EnvironmentProvider>

      </EnterpriseProvider>
    </AuthProvider>
  </StrictMode>,
)
