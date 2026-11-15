import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { JudgmentsLibrary } from './pages/JudgmentsLibrary';
import { UploadJudgment } from './pages/UploadJudgment';
import { JudgmentDetails } from './pages/JudgmentDetails';
import { CasesLibrary } from './pages/CasesLibrary';
import { CreateCase } from './pages/CreateCase';
import { CaseDetails } from './pages/CaseDetails';
import { HearingsManagement } from './pages/HearingsManagement';
import { AddHearing } from './pages/AddHearing';
import { HearingDetails } from './pages/HearingDetails';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Authenticated Workspace Application Shell */}
        <Route path="/" element={<AppLayout />}>
          {/* Dashboard */}
          <Route index element={<Dashboard />} />

          {/* Judgments Module */}
          <Route path="judgments" element={<JudgmentsLibrary />} />
          <Route path="judgments/upload" element={<UploadJudgment />} />
          <Route path="judgments/:id" element={<JudgmentDetails />} />

          {/* Cases Module */}
          <Route path="cases" element={<CasesLibrary />} />
          <Route path="cases/new" element={<CreateCase />} />
          <Route path="cases/:id" element={<CaseDetails />} />

          {/* Hearings Module */}
          <Route path="hearings" element={<HearingsManagement />} />
          <Route path="hearings/new" element={<AddHearing />} />
          <Route path="hearings/:id" element={<HearingDetails />} />

          {/* Settings Module */}
          <Route path="settings" element={<Settings />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
