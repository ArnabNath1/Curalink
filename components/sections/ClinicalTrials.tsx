// Fix: Create the ClinicalTrials component which was previously a placeholder.
import React, { useState } from 'react';
import { ClinicalTrial } from '../../types';
import { clinicalTrialsGovService } from '../../services/clinicalTrialsGovService';
import { geminiService } from '../../services/geminiService';
import { useAppContext } from '../../context/AppContext';
import { ICONS } from '../../constants';
import Card from '../shared/Card';
import Button from '../shared/Button';
import Spinner from '../shared/Spinner';
import Modal from '../shared/Modal';
import { Illustration } from '../shared/Illustration';

interface ClinicalTrialsProps {
  manageMode?: boolean;
}

const ClinicalTrials: React.FC<ClinicalTrialsProps> = ({ manageMode = false }) => {
  const { toggleFavorite, isFavorite } = useAppContext();
  const [trials, setTrials] = useState<ClinicalTrial[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrial, setSelectedTrial] = useState<ClinicalTrial | null>(null);
  const [summary, setSummary] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setHasSearched(true);
    setIsLoading(true);
    const results = await clinicalTrialsGovService.searchTrials(searchQuery);
    setTrials(results);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleViewDetails = (trial: ClinicalTrial) => {
    setSelectedTrial(trial);
    setSummary(''); // Reset summary
  };

  const handleGetSummary = async () => {
    if (!selectedTrial) return;
    setIsSummaryLoading(true);
    const fullText = `Title: ${selectedTrial.title}\nSummary: ${selectedTrial.summary}\nEligibility: ${selectedTrial.eligibility}`;
    const result = await geminiService.getSummary(fullText);
    setSummary(result);
    setIsSummaryLoading(false);
  };
  
  const closeModal = () => {
    setSelectedTrial(null);
    setSummary('');
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-brand-dark mb-6">
        {manageMode ? 'Manage Clinical Trials' : 'Discover Clinical Trials'}
      </h1>
      
      <div className="mb-6 flex gap-2 items-center">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search by condition, treatment, or location (e.g., Lung Cancer)"
            className="w-full p-4 pl-12 border-2 border-brand-gray rounded-xl focus:ring-2 focus:ring-brand-primary bg-white text-brand-dark"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{ICONS.search}</div>
        </div>
        <Button onClick={handleSearch} disabled={isLoading || !searchQuery.trim()}>
          {isLoading ? <Spinner /> : null}
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      <div>
        {isLoading && <div className="flex justify-center py-10"><Spinner size="lg" /></div>}
        
        {!hasSearched && !isLoading && (
            <Illustration type="search" text="Use the search bar above to find clinical trials relevant to you." />
        )}

        {hasSearched && !isLoading && trials.length === 0 && (
          <Illustration type="empty" text={`We couldn't find any trials for "${searchQuery}". Try a different search term.`} />
        )}

        {!isLoading && trials.length > 0 && (
          <div className="space-y-4">
            {trials.map((trial) => (
              <Card key={trial.id} className="group">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-brand-dark group-hover:text-brand-primary">{trial.title}</h3>
                    <p className="text-sm text-gray-500">{trial.location} &bull; <span className="font-semibold">{trial.status}</span></p>
                  </div>
                  <button onClick={() => toggleFavorite(trial)} className={`p-2 rounded-full transition-colors ${isFavorite(trial.id) ? 'text-yellow-500 bg-yellow-100' : 'text-gray-400 hover:text-yellow-400 hover:bg-gray-100'}`}>
                    {isFavorite(trial.id) ? ICONS.starFilled : ICONS.star}
                  </button>
                </div>
                <p className="mt-2 text-brand-text line-clamp-2">{trial.summary}</p>
                <div className="mt-4">
                  <Button variant="ghost" size="sm" onClick={() => handleViewDetails(trial)}>View Details</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={!!selectedTrial} onClose={closeModal} title={selectedTrial?.title || 'Trial Details'}>
        {selectedTrial && (
          <div>
            <div className="space-y-4">
                <div>
                    <h4 className="font-bold">Status</h4>
                    <p>{selectedTrial.status}</p>
                </div>
                 <div>
                    <h4 className="font-bold">Location</h4>
                    <p>{selectedTrial.location}</p>
                </div>
                <div>
                    <h4 className="font-bold">Summary</h4>
                    <p className="whitespace-pre-wrap">{selectedTrial.summary}</p>
                </div>
                <div>
                    <h4 className="font-bold">Eligibility Criteria</h4>
                    <p className="whitespace-pre-wrap">{selectedTrial.eligibility}</p>
                </div>
            </div>
            
            <div className="mt-6 border-t border-brand-gray pt-4">
              <h4 className="font-bold mb-2 text-brand-primary">Simplified Summary (Powered by Gemini)</h4>
              <Button onClick={handleGetSummary} disabled={isSummaryLoading}>
                {isSummaryLoading && <Spinner />}
                {isSummaryLoading ? 'Generating...' : 'Generate Patient-Friendly Summary'}
              </Button>
              {summary && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="whitespace-pre-wrap">{summary}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ClinicalTrials;
