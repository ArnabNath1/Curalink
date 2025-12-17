import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserType, Profile, Page, FavoriteItem } from '../types';
import { dbService } from '../services/dbService';

interface AppContextType {
  isAuthenticated: boolean;
  user: User | null;
  userType: UserType | null;
  profile: Profile | null;
  currentPage: Page;
  favorites: FavoriteItem[];
  authError: string | null;
  signup: (userData: Omit<User, 'id'>, profile: Profile) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUserType: (type: UserType) => void;
  setCurrentPage: (page: Page) => void;
  toggleFavorite: (item: FavoriteItem) => void;
  isFavorite: (id: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserTypeState] = useState<UserType | null>(null);
  const [profile, setProfileState] = useState<Profile | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>(Page.LANDING);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Check for a logged-in session on initial render
    const loggedInUserId = dbService.getSession();
    if (loggedInUserId) {
      const sessionUser = dbService.findUserById(loggedInUserId);
      if (sessionUser) {
        const userProfile = dbService.getProfileForUser(sessionUser.id);
        const userFavorites = dbService.getFavoritesForUser(sessionUser.id);
        
        setIsAuthenticated(true);
        setUser(sessionUser);
        setProfileState(userProfile);
        setUserTypeState(sessionUser.userType);
        setFavorites(userFavorites);
        setCurrentPage(sessionUser.userType === UserType.PATIENT ? Page.PATIENT_DASHBOARD : Page.RESEARCHER_DASHBOARD);
      }
    }
  }, []);

  const signup = async (userData: Omit<User, 'id'>, profileData: Profile) => {
    setAuthError(null);
    const existingUser = dbService.findUserByEmail(userData.email);
    if (existingUser) {
      setAuthError('An account with this email already exists.');
      return;
    }
    const newUser = dbService.addUser(userData);
    dbService.saveProfileForUser(newUser.id, profileData);
    
    // Log the user in after signup
    setIsAuthenticated(true);
    setUser(newUser);
    setProfileState(profileData);
    setUserTypeState(newUser.userType);
    setFavorites([]); // New users have no favorites
    dbService.saveSession(newUser.id);
    setCurrentPage(newUser.userType === UserType.PATIENT ? Page.PATIENT_DASHBOARD : Page.RESEARCHER_DASHBOARD);
  };

  const login = async (email: string, password: string) => {
    setAuthError(null);
    const foundUser = dbService.findUserByEmail(email);
    if (!foundUser) {
      setAuthError('User not found. Please check your email or sign up.');
      return;
    }
    if (foundUser.password !== password) {
      setAuthError('Incorrect password. Please try again.');
      return;
    }

    const userProfile = dbService.getProfileForUser(foundUser.id);
    const userFavorites = dbService.getFavoritesForUser(foundUser.id);
    
    setIsAuthenticated(true);
    setUser(foundUser);
    setProfileState(userProfile);
    setUserTypeState(foundUser.userType);
    setFavorites(userFavorites);
    dbService.saveSession(foundUser.id);
    setCurrentPage(foundUser.userType === UserType.PATIENT ? Page.PATIENT_DASHBOARD : Page.RESEARCHER_DASHBOARD);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setProfileState(null);
    setUserTypeState(null);
    setFavorites([]);
    dbService.clearSession();
    setCurrentPage(Page.LANDING);
  };
  
  const setUserType = (type: UserType) => {
      setUserTypeState(type);
  }

  const toggleFavorite = (item: FavoriteItem) => {
    if (!user) return;
    setFavorites(prevFavorites => {
      const isAlreadyFavorite = prevFavorites.some(fav => fav.id === item.id);
      let newFavorites;
      if (isAlreadyFavorite) {
        newFavorites = prevFavorites.filter(fav => fav.id !== item.id);
      } else {
        newFavorites = [...prevFavorites, item];
      }
      dbService.saveFavoritesForUser(user.id, newFavorites);
      return newFavorites;
    });
  };

  const isFavorite = (id: string) => {
    return favorites.some(fav => fav.id === id);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        user,
        userType,
        profile,
        currentPage,
        favorites,
        authError,
        signup,
        login,
        logout,
        setUserType,
        setCurrentPage,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};