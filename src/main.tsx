
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AdminAuthProvider } from './hooks/useAdminAuth.ts'

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AdminAuthProvider>
      <App />
    </AdminAuthProvider>
  </BrowserRouter>
);
