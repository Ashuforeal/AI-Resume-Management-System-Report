import React from 'react';
import { CandidateProfile } from '../types';
import { Mail, Phone, Briefcase, Trash2 } from 'lucide-react';

interface ResumeCardProps {
  candidate: CandidateProfile;
  matchScore?: number;
  matchReasoning?: string;
  onDelete?: (id: string) => void;
}

export const ResumeCard: React.FC<ResumeCardProps> = ({ candidate, matchScore, matchReasoning, onDelete }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col">
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{candidate.fullName}</h3>
            <p className="text-slate-500 text-sm flex items-center mt-1">
              <Briefcase className="w-3 h-3 mr-1" /> {candidate.yearsOfExperience} Years Exp.
            </p>
          </div>
          {matchScore !== undefined && (
            <div className={`flex flex-col items-end`}>
              <span className={`text-xl font-bold ${
                matchScore > 80 ? 'text-green-600' : matchScore > 50 ? 'text-amber-600' : 'text-slate-400'
              }`}>
                {matchScore}%
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Match</span>
            </div>
          )}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-slate-600">
            <Mail className="w-4 h-4 mr-2 text-slate-400" />
            <span className="truncate">{candidate.email}</span>
          </div>
          <div className="flex items-center text-sm text-slate-600">
            <Phone className="w-4 h-4 mr-2 text-slate-400" />
            <span>{candidate.phone || 'N/A'}</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
            {candidate.summary}
          </p>
        </div>

        {matchReasoning && (
           <div className="mb-4 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
             <p className="text-xs text-indigo-800 font-medium">AI Analysis:</p>
             <p className="text-xs text-indigo-700 mt-1">{matchReasoning}</p>
           </div>
        )}

        <div className="flex flex-wrap gap-2 mt-auto">
          {candidate.skills.slice(0, 5).map((skill, idx) => (
            <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-medium border border-slate-200">
              {skill}
            </span>
          ))}
          {candidate.skills.length > 5 && (
            <span className="px-2.5 py-1 bg-white text-slate-500 text-xs rounded-full font-medium border border-slate-200">
              +{candidate.skills.length - 5}
            </span>
          )}
        </div>
      </div>
      
      {onDelete && (
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button 
            onClick={() => onDelete(candidate.id)}
            className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center font-medium"
          >
            <Trash2 className="w-3 h-3 mr-1.5" />
            Remove Candidate
          </button>
        </div>
      )}
    </div>
  );
};