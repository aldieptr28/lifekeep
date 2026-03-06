import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { useAppStore } from './store/useAppStore';
import { useEffect } from 'react';
import { Toaster } from './components/ui/sonner';

import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import Vehicles from '@/pages/Vehicles';
import Documents from '@/pages/Documents';
import MedicinePage from '@/pages/Medicine';
import HistoryPage from '@/pages/History';
import Debts from '@/pages/Debts';

function App() {
  const { loadSampleData, vehicles, documents, medicines } = useAppStore();

  // Initialize sample data on first load if empty
  useEffect(() => {
    if (vehicles.length === 0 && documents.length === 0 && medicines.length === 0) {
      loadSampleData();
    }
  }, [vehicles.length, documents.length, medicines.length, loadSampleData]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/medicine" element={<MedicinePage />} />
            <Route path="/debts" element={<Debts />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>

      {/* Global Toaster for Notifications */}
      <Toaster position="bottom-right" />
    </>
  );
}

export default App;
