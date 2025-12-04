import { CandidateProfile } from '../types';

const STORAGE_KEY = 'ai_resume_system_candidates';

export const StorageService = {
  getAllCandidates: (): CandidateProfile[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to load candidates', e);
      return [];
    }
  },

  saveCandidate: (candidate: CandidateProfile): void => {
    const candidates = StorageService.getAllCandidates();
    const updated = [candidate, ...candidates];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  deleteCandidate: (id: string): void => {
    const candidates = StorageService.getAllCandidates();
    const updated = candidates.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  seedData: (): void => {
    const current = StorageService.getAllCandidates();
    if (current.length === 0) {
      const mockData: CandidateProfile[] = [
        {
          id: '1',
          fullName: 'Alice Java',
          email: 'alice@example.com',
          phone: '555-0101',
          summary: 'Senior Backend Engineer with 8 years of experience in Java, Spring Boot, and Microservices.',
          skills: ['Java', 'Spring Boot', 'MySQL', 'Kafka', 'Docker'],
          yearsOfExperience: 8,
          rawResumeText: 'Experienced Java Developer...',
          addedAt: new Date().toISOString(),
        },
        {
          id: '2',
          fullName: 'Bob React',
          email: 'bob@example.com',
          phone: '555-0102',
          summary: 'Frontend specialist focusing on React, TypeScript, and accessible UI design.',
          skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
          yearsOfExperience: 5,
          rawResumeText: 'Frontend Developer...',
          addedAt: new Date().toISOString(),
        }
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
    }
  }
};