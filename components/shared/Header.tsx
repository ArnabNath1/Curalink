
import React from 'react';
import { useAppContext } from '../../context/AppContext';
import Button from './Button';
import { ICONS } from '../../constants';
import { Page, UserType } from '../../types';

const Header: React.FC = () => {
  const { user, logout, userType, setCurrentPage } = useAppContext();

  const handleLogoClick = () => {
    if(userType === UserType.PATIENT) {
        setCurrentPage(Page.PATIENT_DASHBOARD);
    } else if (userType === UserType.RESEARCHER) {
        setCurrentPage(Page.RESEARCHER_DASHBOARD);
    }
  };

  return (
    <header className="bg-brand-surface/80 backdrop-blur-md sticky top-0 z-50 border-b border-brand-gray">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div 
            className="text-3xl font-extrabold text-brand-primary cursor-pointer"
            onClick={handleLogoClick}
          >
            CuraLink
          </div>
          <div className="flex items-center gap-4">
            <span className="text-brand-muted font-semibold">
              Welcome, {user?.name || 'User'}
            </span>
            <Button onClick={logout} variant="ghost" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
