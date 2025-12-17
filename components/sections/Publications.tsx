// Fix: Create the Publications component which was previously a placeholder.
import React, { useState } from 'react';
import { Publication } from '../../types';
import { pubmedService } from '../../services/pubmedService';
import { geminiService } from '../../services/geminiService';
import { useAppContext } from '../../context/AppContext';
import { ICONS } from '../../constants';
import Card from '../shared/Card';
import Button from '../shared/Button';
import Spinner from '../shared/Spinner';
import Modal from '../shared/Modal';
import { Illustration } from '../shared/Illustration';

const Publications: React.FC = () => {
  const { toggleFavorite, isFavorite } = useAppContext();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPub, setSelectedPub] = useState<Publication | null>(null);
  const [summary, setSummary] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);


  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setHasSearched(true);
    setIsLoading(true);
    const results = await pubmedService.searchPublications(searchQuery);
    setPublications(results);
    setIsLoading(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const handleViewDetails = (pub: Publication) => {
    setSelectedPub(pub);
    setSummary(''); // Reset summary
  };

  const handleGetSummary = async () => {
    if (!selectedPub) return;
    setIsSummaryLoading(true);
    const result = await geminiService.getSummary(`Title: ${selectedPub.title}`);
    setSummary(result);
    setIsSummaryLoading(false);
  };
  
  const closeModal = () => {
    setSelectedPub(null);
    setSummary('');
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-brand-dark mb-6">Medical Publications</h1>
      
      <div className="mb-6 flex gap-2 items-center">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search by topic, author, or journal (e.g., CAR-T, Dr. Lee)"
            className="w-full p-4 pl-12 border-2 border-brand-gray rounded-xl focus:ring-2 focus:ring-brand-primary bg-white text-brand-dark"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{ICONS.search}</div>
        </div>
        <Button onClick={handleSearch} disabled={isLoading || !searchQuery.trim()}>
          {isLoading ? <Spinner /> : 'Search'}
        </Button>
      </div>

      <div>
        {isLoading && <div className="flex justify-center py-10"><Spinner size="lg" /></div>}
        
        {!hasSearched && !isLoading && (
            <Illustration type="search" text="Use the search bar above to find relevant medical research." />
        )}
        
        {hasSearched && !isLoading && publications.length === 0 && (
          <Illustration type="empty" text={`We couldn't find any publications for "${searchQuery}". Try another term.`} />
        )}
        
        {!isLoading && publications.length > 0 && (
          <div className="space-y-4">
            {publications.map((pub) => (
              <Card key={pub.id} className="group">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-brand-dark group-hover:text-brand-primary">{pub.title}</h3>
                    <p className="text-sm text-gray-500">{pub.authors.slice(0, 2).join(', ')}{pub.authors.length > 2 ? ' et al.' : ''}</p>
                    <p className="text-sm text-gray-500">{pub.journal}, {pub.year}</p>
                  </div>
                   <button onClick={() => toggleFavorite(pub)} className={`p-2 rounded-full transition-colors ${isFavorite(pub.id) ? 'text-yellow-500 bg-yellow-100' : 'text-gray-400 hover:text-yellow-400 hover:bg-gray-100'}`}>
                    {isFavorite(pub.id) ? ICONS.starFilled : ICONS.star}
                  </button>
                </div>
                <div className="mt-4">
                  <Button variant="ghost" size="sm" onClick={() => handleViewDetails(pub)}>Read More & Summarize</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Modal isOpen={!!selectedPub} onClose={closeModal} title={selectedPub?.title || 'Publication Details'}>
        {selectedPub && (
          <div>
            <div className="space-y-2 mb-4">
                <p><strong>Authors:</strong> {selectedPub.authors.join(', ')}</p>
                <p><strong>Journal:</strong> {selectedPub.journal}</p>
                <p><strong>Year:</strong> {selectedPub.year}</p>
                <a href={selectedPub.url} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline flex items-center gap-1">
                    View on PubMed {ICONS.arrowRight}
                </a>
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

export default Publications;
