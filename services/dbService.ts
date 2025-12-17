import { User, Profile, FavoriteItem } from '../types';

const DB_KEY = 'cura_link_database';
const SESSION_KEY = 'cura_link_session';

interface Database {
  users: User[];
  profiles: Record<string, Profile>;
  favorites: Record<string, FavoriteItem[]>;
}

class DBService {
  private db: Database;

  constructor() {
    this.db = this.loadDB();
  }

  private loadDB(): Database {
    try {
      const dbJson = localStorage.getItem(DB_KEY);
      return dbJson ? JSON.parse(dbJson) : { users: [], profiles: {}, favorites: {} };
    } catch (error) {
      console.error("Failed to load database from localStorage", error);
      return { users: [], profiles: {}, favorites: {} };
    }
  }

  private saveDB(): void {
    localStorage.setItem(DB_KEY, JSON.stringify(this.db));
  }
  
  // User Management
  findUserByEmail(email: string): User | undefined {
    return this.db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id: string): User | undefined {
    return this.db.users.find(u => u.id === id);
  }

  addUser(userData: Omit<User, 'id'>): User {
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    this.db.users.push(newUser);
    this.saveDB();
    return newUser;
  }

  // Profile Management
  getProfileForUser(userId: string): Profile | null {
    return this.db.profiles[userId] || null;
  }

  saveProfileForUser(userId: string, profile: Profile): void {
    this.db.profiles[userId] = profile;
    this.saveDB();
  }

  // Favorites Management
  getFavoritesForUser(userId: string): FavoriteItem[] {
    return this.db.favorites[userId] || [];
  }

  saveFavoritesForUser(userId: string, favorites: FavoriteItem[]): void {
    this.db.favorites[userId] = favorites;
    this.saveDB();
  }
  
  // Session Management
  getSession(): string | null {
    return localStorage.getItem(SESSION_KEY);
  }

  saveSession(userId: string): void {
    localStorage.setItem(SESSION_KEY, userId);
  }

  clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
  }
}

export const dbService = new DBService();