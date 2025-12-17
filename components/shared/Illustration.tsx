import React from 'react';
import Card from './Card';
import { ICONS } from '../../constants';

interface IllustrationProps {
  type: 'search' | 'empty';
  text: string;
}

const illustrations = {
  search: (
    <div className="bg-brand-light-blue rounded-full p-6 text-brand-primary">
      {ICONS.search}
    </div>
  ),
  empty: (
    <div className="bg-red-100 rounded-full p-6 text-red-500">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    </div>
  )
};

export const Illustration: React.FC<IllustrationProps> = ({ type, text }) => {
  return (
    <Card className="text-center py-10 flex flex-col items-center">
      {illustrations[type]}
      <p className="text-brand-muted mt-4 max-w-md">{text}</p>
    </Card>
  );
};