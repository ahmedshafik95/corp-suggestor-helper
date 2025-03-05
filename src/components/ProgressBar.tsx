
import React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="w-full mb-8">
      <div className="w-full flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-600">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <span className="text-lg font-medium">Venn</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="text-sm font-medium">Steps</span>
          </div>
          <Button variant="outline" size="sm" className="h-9 px-4 rounded-full">
            Help
          </Button>
        </div>
      </div>
      
      <div className="w-full h-1 bg-gray-200 mb-8">
        <div 
          className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
