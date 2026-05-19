import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient()

const v3SiteKey = import.meta.env.VITE_V3_SITE_KEY;
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <GoogleReCaptchaProvider reCaptchaKey={v3SiteKey || ""}>
       <App />
       </GoogleReCaptchaProvider>
    </QueryClientProvider>
   
  </StrictMode>,
)
