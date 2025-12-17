// Fix: Created the PatientDashboard component.
import React, { useState, useMemo } from 'react';
import { ICONS } from '../../constants';
import Icon from '../shared/Icon';
import TrialMatcher from '../sections/TrialMatcher';
import Experts from '../sections/Experts';
import Forums from '../sections/Forums';
import Favorites from '../sections/Favorites';
import ClinicalTrials from '../sections/ClinicalTrials';
import Publications from '../sections/Publications';
import { useAppContext } from '../../context/AppContext';
import { PatientProfile } from '../../types';

type PatientTab = 'dashboard' | 'matcher' | 'trials' | 'publications' | 'experts' | 'forums' | 'favorites';

const PatientDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PatientTab>('dashboard');

  const navItems = useMemo(() => [
    { id: 'dashboard', label: 'Dashboard', icon: ICONS.dashboard },
    { id: 'matcher', label: 'Trial Matcher', icon: ICONS.star },
    { id: 'trials', label: 'Clinical Trials', icon: ICONS.lab },
    { id: 'publications', label: 'Publications', icon: ICONS.book },
    { id: 'experts', label: 'Find Experts', icon: ICONS.users },
    { id: 'forums', label: 'Forums', icon: ICONS.chat },
    { id: 'favorites', label: 'My Favorites', icon: ICONS.starFilled },
  ], []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'matcher':
        return <TrialMatcher />;
      case 'trials':
        return <ClinicalTrials />;
      case 'publications':
        return <Publications />;
      case 'experts':
        return <Experts />;
      case 'forums':
        return <Forums />;
      case 'favorites':
        return <Favorites />;
      default:
        return null;
    }
  };

  const Sidebar = () => (
    <aside className="w-full lg:w-64 bg-brand-surface p-4 space-y-2 rounded-2xl border border-brand-gray lg:sticky lg:top-28">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id as PatientTab)}
          className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left font-bold transition-colors duration-200 ${
            activeTab === item.id
              ? 'bg-blue-100 text-brand-primary'
              : 'text-brand-text hover:bg-gray-100'
          }`}
        >
          <Icon className="w-6 h-6">{item.icon}</Icon>
          <span>{item.label}</span>
        </button>
      ))}
    </aside>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <Sidebar />
        <main className="flex-1">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const DashboardContent: React.FC = () => {
  const { profile } = useAppContext();
  const patientProfile = profile as PatientProfile;

  return (
    <div>
      <h1 className="text-4xl font-bold text-brand-dark mb-6">Patient Dashboard</h1>
      <div className="bg-brand-surface p-6 rounded-2xl border border-brand-gray">
        <h2 className="text-2xl font-bold mb-4">Your Health Summary</h2>
        {patientProfile?.medicalConditions?.length > 0 ? (
          <div>
            <p className="text-brand-muted mb-2">We've identified the following conditions to help personalize your search:</p>
            <div className="flex flex-wrap gap-2">
              {patientProfile.medicalConditions.map((condition, index) => (
                <span key={index} className="bg-blue-200 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                  {condition}
                </span>
              ))}
            </div>
             <p className="text-brand-muted mt-4">Visit the <strong>Trial Matcher</strong> tab to find relevant clinical trials based on your profile.</p>
          </div>
        ) : (
          <p className="text-brand-muted">Your profile is not yet complete. Please update it to get personalized results.</p>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
