import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Page, PatientProfile, UserType } from '../../types';
import Button from '../shared/Button';
import { geminiService } from '../../services/geminiService';
import Spinner from '../shared/Spinner';

const PatientOnboarding: React.FC = () => {
  const { signup, authError, setCurrentPage } = useAppContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userInfo, setUserInfo] = useState('');
  const [parsedConditions, setParsedConditions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleParseInfo = async () => {
    if (!userInfo.trim()) return;
    setIsLoading(true);
    const conditions = await geminiService.parseConditions(userInfo);
    setParsedConditions(conditions);
    setIsLoading(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleParseInfo();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedConditions.length === 0) {
        alert("Please analyze your info before finishing setup.");
        return;
    }
    const profile: PatientProfile = {
      medicalConditions: parsedConditions,
      additionalInfo: userInfo,
    };
    const userData = { name, email, password, userType: UserType.PATIENT };
    
    setIsLoading(true);
    await signup(userData, profile);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl bg-brand-surface p-8 rounded-2xl shadow-lg">
        {step === 1 && (
            <>
                <h1 className="text-3xl font-bold text-brand-dark mb-2">Create your Patient Account</h1>
                <p className="text-brand-muted mb-6">Let's start with your account details.</p>
                <form onSubmit={() => setStep(2)} className="space-y-4">
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full p-3 border-2 border-brand-gray rounded-xl bg-white text-brand-dark" placeholder="e.g., Jane Doe"/>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-3 border-2 border-brand-gray rounded-xl bg-white text-brand-dark" placeholder="you@example.com"/>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-3 border-2 border-brand-gray rounded-xl bg-white text-brand-dark" placeholder="••••••••"/>
                    </div>
                    {authError && <p className="text-red-500 text-sm">{authError}</p>}
                    <div className="pt-2">
                        <Button type="submit" size="lg" disabled={!name || !email || !password}>Next Step</Button>
                    </div>
                </form>
            </>
        )}
        
        {step === 2 && (
             <form onSubmit={handleSubmit}>
                <h1 className="text-3xl font-bold text-brand-dark mb-2">Tell us about yourself</h1>
                <p className="text-brand-muted mb-6">This helps us personalize your experience. You can describe your condition, diagnosis, or health goals.</p>
                
                <div className="space-y-4">
                  <textarea
                    className="w-full p-4 border-2 border-brand-gray rounded-xl focus:ring-2 focus:ring-brand-primary bg-white text-brand-dark"
                    rows={5}
                    placeholder="e.g., 'I was recently diagnosed with Stage II non-small cell lung cancer.' or 'Looking for trials related to brain cancer and glioma.'"
                    value={userInfo}
                    onChange={(e) => setUserInfo(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <Button type="button" onClick={handleParseInfo} disabled={isLoading || !userInfo.trim()}>
                    {isLoading && !parsedConditions.length && <Spinner />}
                    {isLoading && !parsedConditions.length ? 'Analyzing...' : 'Analyze My Info'}
                  </Button>
                </div>

                {parsedConditions.length > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h2 className="font-bold text-brand-primary mb-2">Identified Medical Conditions:</h2>
                    <div className="flex flex-wrap gap-2">
                      {parsedConditions.map((condition, index) => (
                        <span key={index} className="bg-blue-200 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-8 flex items-center justify-between">
                    <Button type="button" variant="ghost" onClick={() => setStep(1)}>Back</Button>
                    <Button size="lg" type="submit" disabled={isLoading || parsedConditions.length === 0}>
                        {isLoading && <Spinner />}
                        Finish Setup
                    </Button>
                </div>
            </form>
        )}
      </div>
    </div>
  );
};

export default PatientOnboarding;