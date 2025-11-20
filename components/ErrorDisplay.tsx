
import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="max-w-md mx-auto bg-red-500/10 border border-red-500/20 backdrop-blur-sm text-red-200 px-6 py-4 rounded-xl flex items-start space-x-3 shadow-lg">
      <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div>
        <h3 className="font-bold text-red-400">發生錯誤</h3>
        <p className="text-sm mt-1 opacity-90">{message}</p>
      </div>
    </div>
  );
};

export default ErrorDisplay;
