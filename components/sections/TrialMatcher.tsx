// Fix: Created the TrialMatcher component.
import React, { useState, useEffect } from 'react';
import { ClinicalTrial, PatientProfile } from '../../types';
import { clinicalTrialsGovService } from '../../services/clinicalTrialsGovService';
import { geminiService } from '../../services/geminiService';
import { useAppContext } from '../../context/AppContext';
import Card from '../shared/Card';
import Button from '../shared/Button';
import Spinner from '../shared/Spinner';
import Modal from '../shared/Modal';
import ReactMarkdown from 'react-markdown';

const TrialMatcher: React.FC = () => {
  const { profile } = useAppContext();
  const [trials, setTrials] = useState<ClinicalTrial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTrial, setSelectedTrial] = useState<ClinicalTrial | null>(null);
  const [report, setReport] = useState('');
  const [isReportLoading, setIsReportLoading] = useState(false);

  const patientProfile = profile as PatientProfile;
  
  useEffect(() => {
    const findMatchingTrials = async () => {
      if (patientProfile && patientProfile.medicalConditions?.length > 0) {
        setIsLoading(true);
        const query = patientProfile.medicalConditions.join(' OR ');
        const results = await clinicalTrialsGovService.searchTrials(query);
        setTrials(results);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };
    findMatchingTrials();
  }, [patientProfile]);

  const handleViewReport = async (trial: ClinicalTrial) => {
    setSelectedTrial(trial);
    setReport('');
    setIsReportLoading(true);
    
    const patientInfo = `Conditions: ${patientProfile.medicalConditions.join(', ')}. Additional Info: ${patientProfile.additionalInfo}`;
    const trialInfo = `Title: ${trial.title}\nStatus: ${trial.status}\nSummary: ${trial.summary}\nEligibility: ${trial.eligibility}`;
    
    const result = await geminiService.generateTrialMatchReport(patientInfo, trialInfo);
    setReport(result);
    setIsReportLoading(false);
  };
  
  const closeModal = () => {
    setSelectedTrial(null);
    setReport('');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Spinner size="lg" />
        <p className="mt-4 text-brand-muted">Finding clinical trials based on your profile...</p>
      </div>
    );
  }

  if (!patientProfile?.medicalConditions?.length) {
    return (
        <div>
            <h1 className="text-4xl font-bold text-brand-dark mb-6">Trial Matcher</h1>
            <Card className="text-center py-10">
                <h2 className="text-2xl font-bold text-brand-dark">Complete Your Profile</h2>
                <p className="text-brand-muted mt-2">Please complete your patient profile with your medical conditions to use the Trial Matcher.</p>
            </Card>
        </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-brand-dark mb-2">Personalized Trial Matches</h1>
      <p className="text-brand-muted mb-6">Based on your profile, we found the following clinical trials. Click "View Match Report" for an AI-powered analysis.</p>

      {trials.length === 0 ? (
        <Card className="text-center py-10">
          <h2 className="text-2xl font-bold text-brand-dark">No Trials Found</h2>
          <p className="text-brand-muted mt-2">We couldn't find any trials matching your profile conditions: {patientProfile.medicalConditions.join(', ')}. You can try a broader search in the "Clinical Trials" tab.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {trials.map((trial) => (
            <Card key={trial.id}>
              <h3 className="text-xl font-bold text-brand-dark">{trial.title}</h3>
              <p className="text-sm text-gray-500">{trial.location} &bull; <span className="font-semibold">{trial.status}</span></p>
              <p className="mt-2 text-brand-text line-clamp-2">{trial.summary}</p>
              <div className="mt-4">
                <Button variant="primary" size="sm" onClick={() => handleViewReport(trial)}>
                    View Match Report
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={!!selectedTrial} onClose={closeModal} title={`Match Report: ${selectedTrial?.title || ''}`}>
          <div>
            {isReportLoading ? (
                <div className="flex flex-col items-center justify-center py-10">
                    <Spinner />
                    <p className="mt-2 text-brand-muted">Generating personalized report...</p>
                </div>
            ) : (
                <div className="prose max-w-none">
                    <ReactMarkdown>{report}</ReactMarkdown>
                </div>
            )}
          </div>
      </Modal>
    </div>
  );
};

export default TrialMatcher;
