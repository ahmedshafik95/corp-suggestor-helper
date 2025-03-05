
import React from "react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progress = Math.floor((currentStep / totalSteps) * 100);
  
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between mb-2 text-sm text-gray-500">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{progress}% Complete</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden dark:bg-gray-800">
        <div 
          className="h-full bg-emerald-600 transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
