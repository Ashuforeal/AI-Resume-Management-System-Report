import React, { useState } from 'react';
import { GeminiService } from '../services/geminiService';
import { StorageService } from '../services/storageService';
import { CandidateProfile } from '../types';
import { Loader2, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export const AddResumeView: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [parsedData, setParsedData] = useState<Omit<CandidateProfile, 'id' | 'addedAt'> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleAnalyze = async () => {
    if (!resumeText.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await GeminiService.parseResume(resumeText);
      setParsedData(result);
    } catch (err) {
      setError("Failed to parse resume. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    if (!parsedData) return;
    
    const newCandidate: CandidateProfile = {
      ...parsedData,
      id: uuidv4(),
      addedAt: new Date().toISOString(),
      rawResumeText: resumeText
    };

    StorageService.saveCandidate(newCandidate);
    setSuccess(true);
    setResumeText('');
    setParsedData(null);
    
    // Reset success message after 3s
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      {/* Input Section */}
      <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h2 className="font-semibold text-slate-800">Raw Resume Input</h2>
          <button 
            onClick={() => setResumeText('John Doe\njohn@example.com\nSenior Developer with 5 years in Java and React.')}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Insert Sample Text
          </button>
        </div>
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste resume text here (PDF/Word parsing simulated)..."
          className="flex-1 w-full p-6 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-mono text-slate-700 leading-relaxed"
        />
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !resumeText}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center transition-all shadow-md hover:shadow-lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Analyzing with Gemini...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Extract Data
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview Section */}
      <div className="flex flex-col h-full space-y-4">
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-100 flex items-center animate-in fade-in slide-in-from-top-4">
            <CheckCircle className="w-5 h-5 mr-2" />
            Candidate saved successfully to database!
          </div>
        )}

        {parsedData ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h2 className="font-semibold text-slate-800">Extracted Information</h2>
            </div>
            <div className="p-6 space-y-6 flex-1 overflow-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase">Full Name</label>
                  <p className="font-medium text-slate-900">{parsedData.fullName}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase">Experience</label>
                  <p className="font-medium text-slate-900">{parsedData.yearsOfExperience} Years</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase">Email</label>
                  <p className="font-medium text-slate-900">{parsedData.email}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase">Phone</label>
                  <p className="font-medium text-slate-900">{parsedData.phone}</p>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase mb-2 block">Skills</label>
                <div className="flex flex-wrap gap-2">
                  {parsedData.skills.map((skill, i) => (
                    <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-sm font-medium border border-indigo-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase mb-1 block">Professional Summary</label>
                <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-3 rounded-lg">
                  {parsedData.summary}
                </p>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex space-x-3">
              <button 
                onClick={() => setParsedData(null)}
                className="flex-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg font-medium transition-colors"
              >
                Discard
              </button>
              <button 
                onClick={handleSave}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex justify-center items-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm & Save
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-slate-100 rounded-xl border border-slate-200 border-dashed flex flex-col items-center justify-center text-slate-400">
            <FileText size={48} className="mb-4 opacity-50" />
            <p className="font-medium">Analysis results will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Icon helper
import { FileText } from 'lucide-react';