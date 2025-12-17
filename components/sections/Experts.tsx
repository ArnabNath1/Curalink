import React, { useState } from 'react';
import { Expert } from '../../types';
import { expertService } from '../../services/expertService';
import { useAppContext } from '../../context/AppContext';
import { ICONS } from '../../constants';
import Card from '../shared/Card';
import Button from '../shared/Button';
import Spinner from '../shared/Spinner';
import { Illustration } from '../shared/Illustration';
import Modal from '../shared/Modal';

const Experts: React.FC = () => {
  const { user, toggleFavorite, isFavorite } = useAppContext();
  const [experts, setExperts] = useState<Expert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [connectMessage, setConnectMessage] = useState('');
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setHasSearched(true);
    setIsLoading(true);
    const results = await expertService.searchExperts(searchQuery);
    setExperts(results);
    setIsLoading(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const openConnectModal = (expert: Expert) => {
    setSelectedExpert(expert);
    setIsConnectModalOpen(true);
  };

  const closeConnectModal = () => {
    setSelectedExpert(null);
    setIsConnectModalOpen(false);
    setConnectMessage('');
  };

  const handleSendRequest = () => {
    if (!selectedExpert) return;
    console.log(`Sending connection request to ${selectedExpert.name} from ${user?.name} with message: "${connectMessage}"`);
    // Simulate sending request
    setSentRequests(prev => new Set(prev).add(selectedExpert.id));
    // In a real app, an API call would be made here.
    closeConnectModal();
    // Maybe show a success toast message here.
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-brand-dark mb-6">Health Experts & Collaborators</h1>
      
      <div className="mb-6 flex gap-2 items-center">
        <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search by name or specialty (e.g., Dr. Reed, Glioma)"
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
        
        {!isLoading && !hasSearched && (
            <Illustration type="search" text="Search for health experts or collaborators by specialty, condition, or name." />
        )}
        
        {!isLoading && hasSearched && experts.length === 0 && (
            <Illustration type="empty" text={`We couldn't find any experts for "${searchQuery}". Try a different term.`} />
        )}

        {!isLoading && experts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experts.map((expert) => (
                <Card key={expert.id} className="flex flex-col text-center items-center">
                    <img src={expert.avatarUrl} alt={expert.name} className="w-24 h-24 rounded-full mb-4 border-4 border-white shadow-md" />
                    <h3 className="text-xl font-bold text-brand-dark">{expert.name}</h3>
                    <p className="text-brand-secondary font-semibold">{expert.title}</p>
                    <p className="text-sm text-gray-500 mb-3">{expert.location}</p>
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {expert.specialties.slice(0, 2).map(spec => (
                            <span key={spec} className="bg-gray-200 text-gray-700 text-xs font-semibold px-2.5 py-0.5 rounded-full truncate" title={spec}>{spec}</span>
                        ))}
                    </div>
                    <div className="flex-grow"></div>
                    <div className="w-full mt-auto pt-4 border-t border-brand-gray">
                        <div className="flex items-center justify-between w-full mb-3">
                            <span className="text-sm text-gray-600">{expert.publications} Publications</span>
                            <button onClick={() => toggleFavorite(expert)} className={`p-2 rounded-full transition-colors ${isFavorite(expert.id) ? 'text-yellow-500 bg-yellow-100' : 'text-gray-400 hover:text-yellow-400 hover:bg-gray-100'}`}>
                                {isFavorite(expert.id) ? ICONS.starFilled : ICONS.star}
                            </button>
                        </div>
                        <Button
                            variant={sentRequests.has(expert.id) ? "ghost" : "primary"}
                            size="sm"
                            className="w-full"
                            onClick={() => openConnectModal(expert)}
                            disabled={sentRequests.has(expert.id)}
                        >
                            {sentRequests.has(expert.id) ? 'Request Sent' : 'Connect'}
                        </Button>
                    </div>
                </Card>
            ))}
            </div>
        )}
      </div>

      <Modal isOpen={isConnectModalOpen} onClose={closeConnectModal} title={`Connect with ${selectedExpert?.name}`}>
            {selectedExpert && (
                <div className="space-y-4">
                    <p className="text-brand-muted">You are sending a connection request to <span className="font-bold">{selectedExpert.name}</span>.</p>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Your Name</label>
                        <input type="text" value={user?.name || ''} readOnly className="w-full p-3 border-2 border-brand-gray rounded-xl bg-gray-100 text-brand-dark"/>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Message (Optional)</label>
                        <textarea
                            value={connectMessage}
                            onChange={(e) => setConnectMessage(e.target.value)}
                            rows={4}
                            placeholder="Introduce yourself and explain why you'd like to connect..."
                            className="w-full p-3 border-2 border-brand-gray rounded-xl bg-white text-brand-dark"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="ghost" onClick={closeConnectModal}>Cancel</Button>
                        <Button onClick={handleSendRequest}>Send Request</Button>
                    </div>
                </div>
            )}
      </Modal>

    </div>
  );
};

export default Experts;