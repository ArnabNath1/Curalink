// Fix: Created types.ts content to define data structures for the application.
export enum UserType {
  PATIENT = 'patient',
  RESEARCHER = 'researcher',
}

export enum Page {
  LANDING = 'landing',
  LOGIN = 'login',
  PATIENT_ONBOARDING = 'patient_onboarding',
  RESEARCHER_ONBOARDING = 'researcher_onboarding',
  PATIENT_DASHBOARD = 'patient_dashboard',
  RESEARCHER_DASHBOARD = 'researcher_dashboard',
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  userType: UserType;
}

export interface PatientProfile {
  medicalConditions: string[];
  additionalInfo: string;
}

export interface ResearcherProfile {
  specialty: string;
  institution: string;
  orcid?: string;
}

export type Profile = PatientProfile | ResearcherProfile;

export interface ClinicalTrial {
  id: string;
  title: string;
  summary: string;
  status: string;
  location: string;
  eligibility: string;
  contact: string;
}

export interface Publication {
  id: string;
  title:string;
  authors: string[];
  journal: string;
  year: number;
  url: string;
}

export interface Expert {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  location: string;
  publications: number;
  avatarUrl: string;
}

export interface ForumPost {
  id: string;
  author: string;
  userType: UserType;
  title: string;
  content: string;
  category: string;
  replies: {
    id: string;
    author: string;
    content: string;
  }[];
}

export type FavoriteItem = ClinicalTrial | Publication | Expert;
