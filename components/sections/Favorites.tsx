
import React from 'react';
import { useAppContext } from '../../context/AppContext';
import Card from '../shared/Card';
import { ClinicalTrial, Expert, Publication, FavoriteItem } from '../../types';

const isClinicalTrial = (item: FavoriteItem): item is ClinicalTrial => 'status' in item;
const isExpert = (item: FavoriteItem): item is Expert => 'specialties' in item;
const isPublication = (item: FavoriteItem): item is Publication => 'journal' in item;

const Favorites: React.FC = () => {
  const { favorites } = useAppContext();

  const trials = favorites.filter(isClinicalTrial);
  const experts = favorites.filter(isExpert);
  const publications = favorites.filter(isPublication);

  return (
    <div>
      <h1 className="text-4xl font-bold text-brand-dark mb-6">My Favorites</h1>

      {favorites.length === 0 ? (
        <p>You haven't saved any items yet. Click the star icon on any trial, expert, or publication to add it here.</p>
      ) : (
        <div className="space-y-8">
          {trials.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Saved Clinical Trials</h2>
              <div className="space-y-4">
                {trials.map(item => <Card key={item.id}><h3 className="font-bold">{item.title}</h3><p className="text-sm text-gray-500">{item.location}</p></Card>)}
              </div>
            </section>
          )}
          {experts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Saved Experts & Collaborators</h2>
               <div className="space-y-4">
                {experts.map(item => <Card key={item.id}><h3 className="font-bold">{item.name}</h3><p className="text-sm text-gray-500">{item.title}</p></Card>)}
              </div>
            </section>
          )}
          {publications.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Saved Publications</h2>
               <div className="space-y-4">
                {publications.map(item => <Card key={item.id}><h3 className="font-bold">{item.title}</h3><p className="text-sm text-gray-500">{item.journal}, {item.year}</p></Card>)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default Favorites;
