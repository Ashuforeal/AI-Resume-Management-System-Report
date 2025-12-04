export interface Skill {
  name: string;
  level?: 'Beginner' | 'Intermediate' | 'Expert';
}

export interface CandidateProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  summary: string;
  skills: string[];
  yearsOfExperience: number;
  rawResumeText: string;
  addedAt: string;
}

export interface SearchResult {
  candidateId: string;
  score: number; // 0-100
  matchReasoning: string;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  ADD_RESUME = 'ADD_RESUME',
  SEARCH = 'SEARCH',
}