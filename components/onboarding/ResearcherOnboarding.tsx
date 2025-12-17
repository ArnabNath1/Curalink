import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Page, ResearcherProfile, UserType } from '../../types';
import Button from '../shared/Button';
import Spinner from '../shared/Spinner';

const ResearcherOnboarding: React.FC = () => {
  const { signup, authError, setCurrentPage } = useAppContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [institution, setInstitution] = useState('');
  const [orcid, setOrcid] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!specialty.trim() || !institution.trim() || !name || !email || !password) {
        return;
    }
    const profile: ResearcherProfile = { specialty, institution, orcid };
    const userData = { name, email, password, userType: UserType.RESEARCHER };

    setIsLoading(true);
    await signup(userData, profile);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-lg bg-brand-surface p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-brand-dark mb-2">Create your Researcher Account</h1>
        <p className="text-brand-muted mb-6">Join the network by creating your professional profile.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
           <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full p-3 border-2 border-brand-gray rounded-xl bg-white text-brand-dark" placeholder="e.g., Dr. Alex Ray"/>
          </div>
          <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-3 border-2 border-brand-gray rounded-xl bg-white text-brand-dark" placeholder="you@example.com"/>
          </div>
          <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-3 border-2 border-brand-gray rounded-xl bg-white text-brand-dark" placeholder="••••••••"/>
          </div>

          <hr className="!my-6" />

          <div>
            <label htmlFor="specialty" className="block text-sm font-bold text-gray-700 mb-1">
              Primary Specialty
            </label>
            <input
              type="text"
              id="specialty"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full p-3 border-2 border-brand-gray rounded-xl bg-white text-brand-dark"
              placeholder="e.g., Neuro-Oncology"
              required
            />
          </div>
          <div>
            <label htmlFor="institution" className="block text-sm font-bold text-gray-700 mb-1">
              Institution / Affiliation
            </label>
            <input
              type="text"
              id="institution"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="w-full p-3 border-2 border-brand-gray rounded-xl bg-white text-brand-dark"
              placeholder="e.g., Memorial Sloan Kettering Cancer Center"
              required
            />
          </div>
          <div>
            <label htmlFor="orcid" className="block text-sm font-bold text-gray-700 mb-1">
              ORCID iD (Optional)
            </label>
            <input
              type="text"
              id="orcid"
              value={orcid}
              onChange={(e) => setOrcid(e.target.value)}
              className="w-full p-3 border-2 border-brand-gray rounded-xl bg-white text-brand-dark"
              placeholder="e.g., 0000-0001-2345-6789"
            />
             <p className="text-xs text-gray-500 mt-1">Providing your ORCID helps automatically import your publications.</p>
          </div>
           {authError && <p className="text-red-500 text-sm">{authError}</p>}
          <div className="pt-4">
            <Button size="lg" type="submit" variant="secondary" className="w-full" disabled={isLoading}>
              {isLoading && <Spinner />}
              Complete Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResearcherOnboarding;