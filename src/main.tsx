import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from '@/components/system/ErrorBoundary'
import './styles/theme.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* BASE_URL is '/' everywhere except the GitHub Pages build, where it's
        '/Recipes/' (see vite.config.ts) — basename must not have a trailing
        slash, or every route fails to match and falls through to the
        catch-all. */}
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
)
