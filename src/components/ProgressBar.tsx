
import React from "react";
import { Menu } from "lucide-react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progressWidth = `${(currentStep / totalSteps) * 100}%`;

  return (
    <div className="w-full border-b border-gray-200">
      <div className="px-4 md:px-6 max-w-5xl mx-auto">
        <div className="w-full flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <button
              aria-label="Toggle menu"
              className="text-gray-600 p-1 rounded-md hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>
            <div className="text-lg font-medium">Venn</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium">Steps</div>
            <button className="px-4 py-1 h-9 text-sm font-medium border border-gray-300 rounded-full hover:bg-gray-50">
              Help
            </button>
          </div>
        </div>
      </div>
      
      <div className="w-full h-[3px] bg-gray-100 relative">
        <div 
          className="h-full bg-blue-600 transition-all duration-300 ease-in-out absolute left-0 top-0"
          style={{ width: progressWidth }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
