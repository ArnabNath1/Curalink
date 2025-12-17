import React, { useState, useMemo } from 'react';
import { ICONS } from '../../constants';
import Icon from '../shared/Icon';
import Experts from '../sections/Experts';
import Forums from '../sections/Forums';
import Favorites from '../sections/Favorites';
import ClinicalTrials from '../sections/ClinicalTrials';
import Card from '../shared/Card';

type ResearcherTab = 'dashboard' | 'collaborators' | 'trials' | 'forums' | 'favorites';

const ResearcherDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ResearcherTab>('dashboard');

  const navItems = useMemo(() => [
    { id: 'dashboard', label: 'Dashboard', icon: ICONS.dashboard },
    { id: 'collaborators', label: 'Collaborators', icon: ICONS.users },
    { id: 'trials', label: 'Manage Trials', icon: ICONS.lab },
    { id: 'forums', label: 'Forums', icon: ICONS.chat },
    { id: 'favorites', label: 'My Favorites', icon: ICONS.star },
  ], []);
  
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'collaborators':
        return <Experts />; // Reusing Experts component for Collaborators
      case 'trials':
        return <ClinicalTrials manageMode={true} />; // Special mode for researchers
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
          onClick={() => setActiveTab(item.id as ResearcherTab)}
          className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left font-bold transition-colors duration-200 ${
            activeTab === item.id
              ? 'bg-green-100 text-brand-secondary'
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

const DashboardContent: React.FC = () => (
    <div>
        <h1 className="text-4xl font-bold text-brand-dark mb-6">Researcher Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <h2 className="text-2xl font-bold mb-4">Quick Stats</h2>
                <p><strong>Patient Questions:</strong> 5 Unanswered</p>
                <p><strong>Active Trials:</strong> 2</p>
                <p><strong>New Collaborator Requests:</strong> 1</p>
            </Card>
             <Card>
                <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
                <p>Dr. Smith replied to your post in 'Immunotherapy Insights'.</p>
                <p>A new patient question was posted in 'Glioma Research'.</p>
            </Card>
        </div>
    </div>
);


export default ResearcherDashboard;