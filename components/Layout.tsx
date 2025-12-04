import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, UserPlus, Search, FileText } from 'lucide-react';

interface LayoutProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentView, onChangeView, children }) => {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 flex items-center space-x-2 border-b border-slate-100">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-800">Resume<span className="text-indigo-600">AI</span></span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => onChangeView(ViewState.DASHBOARD)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              currentView === ViewState.DASHBOARD 
                ? 'bg-indigo-50 text-indigo-700 font-medium' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => onChangeView(ViewState.ADD_RESUME)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              currentView === ViewState.ADD_RESUME 
                ? 'bg-indigo-50 text-indigo-700 font-medium' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-5 h-5" />
            <span>Add Candidate</span>
          </button>

          <button
            onClick={() => onChangeView(ViewState.SEARCH)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              currentView === ViewState.SEARCH 
                ? 'bg-indigo-50 text-indigo-700 font-medium' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Search className="w-5 h-5" />
            <span>Smart Search</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-100 rounded-lg p-3">
            <p className="text-xs font-semibold text-slate-500 uppercase mb-1">System Status</p>
            <div className="flex items-center space-x-2 text-sm text-green-700 font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>Gemini AI Connected</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-slate-800">
            {currentView === ViewState.DASHBOARD && 'Overview'}
            {currentView === ViewState.ADD_RESUME && 'Parse & Add Resume'}
            {currentView === ViewState.SEARCH && 'Skill-Based Search'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {currentView === ViewState.DASHBOARD && 'Welcome back to your recruitment hub.'}
            {currentView === ViewState.ADD_RESUME && 'Use AI to extract structured data from resume text.'}
            {currentView === ViewState.SEARCH && 'Find the best candidates using semantic analysis.'}
          </p>
        </header>
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};