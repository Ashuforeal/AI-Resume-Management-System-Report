import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ViewState, CandidateProfile } from './types';
import { AddResumeView } from './components/AddResumeView';
import { SearchView } from './components/SearchView';
import { StorageService } from './services/storageService';
import { ResumeCard } from './components/ResumeCard';
import { Users, Code, Award } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [candidates, setCandidates] = useState<CandidateProfile[]>([]);

  useEffect(() => {
    // Seed initial data if empty
    StorageService.seedData();
    refreshData();
  }, []);

  const refreshData = () => {
    setCandidates(StorageService.getAllCandidates());
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this candidate?')) {
      StorageService.deleteCandidate(id);
      refreshData();
    }
  };

  // Helper for dashboard view
  const Dashboard = () => {
    const totalCandidates = candidates.length;
    const allSkills = candidates.flatMap(c => c.skills);
    const uniqueSkills = new Set(allSkills).size;
    const avgExp = totalCandidates > 0 
      ? (candidates.reduce((acc, c) => acc + c.yearsOfExperience, 0) / totalCandidates).toFixed(1) 
      : 0;

    return (
      <div className="space-y-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase">Total Candidates</p>
              <p className="text-3xl font-bold text-slate-800">{totalCandidates}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="bg-purple-50 p-3 rounded-lg text-purple-600">
              <Code className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase">Unique Skills Tracked</p>
              <p className="text-3xl font-bold text-slate-800">{uniqueSkills}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="bg-amber-50 p-3 rounded-lg text-amber-600">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase">Avg Experience (Yrs)</p>
              <p className="text-3xl font-bold text-slate-800">{avgExp}</p>
            </div>
          </div>
        </div>

        {/* Recent Candidates */}
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Candidates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.slice(0, 6).map(candidate => (
              <ResumeCard 
                key={candidate.id} 
                candidate={candidate} 
                onDelete={handleDelete}
              />
            ))}
          </div>
          {candidates.length === 0 && (
            <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No candidates found. Go to "Add Candidate" to get started.
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Layout currentView={currentView} onChangeView={(v) => {
      refreshData();
      setCurrentView(v);
    }}>
      {currentView === ViewState.DASHBOARD && <Dashboard />}
      {currentView === ViewState.ADD_RESUME && <AddResumeView />}
      {currentView === ViewState.SEARCH && <SearchView />}
    </Layout>
  );
}