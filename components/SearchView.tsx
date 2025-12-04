import React, { useState } from 'react';
import { GeminiService } from '../services/geminiService';
import { StorageService } from '../services/storageService';
import { CandidateProfile, SearchResult } from '../types';
import { Search, Loader2, Filter, AlertTriangle } from 'lucide-react';
import { ResumeCard } from './ResumeCard';

export const SearchView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<{ candidate: CandidateProfile; result: SearchResult }[] | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setResults(null);

    const allCandidates = StorageService.getAllCandidates();
    
    // If we have few candidates, we can send them all to Gemini.
    // In a real app with pagination, we might pre-filter or use vector search first.
    // Here we assume a reasonable demo size (<20).
    const ranked = await GeminiService.rankCandidates(query, allCandidates);

    // Merge ranked results with full candidate data
    const merged = ranked
      .map(r => {
        const c = allCandidates.find(cand => cand.id === r.candidateId);
        return c ? { candidate: c, result: r } : null;
      })
      .filter((item): item is { candidate: CandidateProfile; result: SearchResult } => item !== null)
      .sort((a, b) => b.result.score - a.result.score);

    setResults(merged);
    setIsSearching(false);
  };

  return (
    <div className="space-y-8">
      {/* Search Input */}
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe the ideal candidate (e.g., 'React developer with 5+ years experience and AWS skills')..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-lg"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-6 h-6" />
          <button
            type="submit"
            disabled={isSearching || !query}
            className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 rounded-xl font-medium transition-colors"
          >
            {isSearching ? <Loader2 className="animate-spin w-5 h-5" /> : 'Search'}
          </button>
        </form>
        <div className="flex justify-center mt-3 space-x-4 text-sm text-slate-500">
          <span className="flex items-center"><Filter className="w-3 h-3 mr-1" /> Semantic Matching</span>
          <span className="flex items-center"><Filter className="w-3 h-3 mr-1" /> Skill Ranking</span>
        </div>
      </div>

      {/* Results */}
      <div className="min-h-[400px]">
        {isSearching ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
            <p className="font-medium">AI is analyzing candidates against your criteria...</p>
          </div>
        ) : results ? (
          results.length > 0 ? (
            <div className="space-y-6">
               <h3 className="text-lg font-bold text-slate-800 flex items-center">
                 Found {results.length} Candidates
                 <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full">Sorted by Relevance</span>
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {results.map((item) => (
                   <ResumeCard 
                     key={item.candidate.id} 
                     candidate={item.candidate} 
                     matchScore={item.result.score}
                     matchReasoning={item.result.matchReasoning}
                   />
                 ))}
               </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-white rounded-xl border border-slate-200 border-dashed">
               <Search className="w-12 h-12 mb-2 opacity-20" />
               <p>No matching candidates found.</p>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <p>Enter a job description to start the magic.</p>
          </div>
        )}
      </div>
    </div>
  );
};