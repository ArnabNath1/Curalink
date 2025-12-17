import React from 'react';
import { useAppContext } from './context/AppContext';
import { Page } from './types';
import LandingPage from './components/landing/LandingPage';
import LoginPage from './components/auth/LoginPage';
import PatientOnboarding from './components/onboarding/PatientOnboarding';
import ResearcherOnboarding from './components/onboarding/ResearcherOnboarding';
import PatientDashboard from './components/dashboard/PatientDashboard';
import ResearcherDashboard from './components/dashboard/ResearcherDashboard';
import Header from './components/shared/Header';

const App: React.FC = () => {
  const { currentPage, isAuthenticated } = useAppContext();

  const renderPage = () => {
    if (isAuthenticated) {
        if (currentPage === Page.PATIENT_DASHBOARD) return <PatientDashboard />;
        if (currentPage === Page.RESEARCHER_DASHBOARD) return <ResearcherDashboard />;
    }

    switch (currentPage) {
      case Page.LOGIN:
        return <LoginPage />;
      case Page.PATIENT_ONBOARDING:
        return <PatientOnboarding />;
      case Page.RESEARCHER_ONBOARDING:
        return <ResearcherOnboarding />;
      case Page.LANDING:
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="bg-brand-bg min-h-screen text-brand-text font-sans">
      {isAuthenticated && <Header />}
      <main>
        {renderPage()}
      </main>
    </div>
  );
};

export default App;