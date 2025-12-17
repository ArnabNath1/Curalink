import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { UserType, Page } from '../../types';
import Button from '../shared/Button';

const LandingPage: React.FC = () => {
  const { setUserType, setCurrentPage } = useAppContext();

  const handleSelection = (type: UserType) => {
    setUserType(type);
    setCurrentPage(type === UserType.PATIENT ? Page.PATIENT_ONBOARDING : Page.RESEARCHER_ONBOARDING);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-gradient-to-b from-brand-light-blue to-brand-bg">
      <div className="absolute top-6 right-6">
        <Button variant="ghost" onClick={() => setCurrentPage(Page.LOGIN)}>
          Already have an account? Log In
        </Button>
      </div>
      <h1 className="text-6xl md:text-8xl font-extrabold text-brand-primary mb-4">
        CuraLink
      </h1>
      <p className="text-xl md:text-2xl text-brand-muted max-w-3xl mb-12">
        Connecting patients and researchers to discover relevant clinical trials, publications, and health experts.
      </p>
      <div className="flex flex-col md:flex-row gap-6">
        <div 
            onClick={() => handleSelection(UserType.PATIENT)}
            className="bg-brand-surface border-2 border-brand-gray rounded-2xl p-8 hover:border-brand-primary hover:shadow-xl transition-all duration-300 cursor-pointer w-80"
        >
            <h2 className="text-2xl font-bold text-brand-dark mb-4">For Patients / Caregivers</h2>
            <p className="text-brand-muted mb-6">Find personalized trials, experts, and insights for your health journey.</p>
            <Button size="lg" variant="primary" className="w-full pointer-events-none">Get Started</Button>
        </div>
        <div 
            onClick={() => handleSelection(UserType.RESEARCHER)}
            className="bg-brand-surface border-2 border-brand-gray rounded-2xl p-8 hover:border-brand-secondary hover:shadow-xl transition-all duration-300 cursor-pointer w-80"
        >
            <h2 className="text-2xl font-bold text-brand-dark mb-4">For Researchers</h2>
            <p className="text-brand-muted mb-6">Discover collaborators, manage trials, and engage with the community.</p>
            <Button size="lg" variant="secondary" className="w-full pointer-events-none">Join the Network</Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;