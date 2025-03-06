
import React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progressWidth = `${(currentStep / totalSteps) * 100}%`;

  return (
    <div className="w-full border-b border-gray-200">
      <div className="container px-4 md:px-6 max-w-5xl mx-auto">
        <div className="w-full flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="p-2 text-gray-600">
              <Menu size={20} />
              <span className="sr-only">Toggle menu</span>
            </Button>
            <span className="text-lg font-medium">Venn</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Steps</span>
            <Button variant="outline" size="sm" className="rounded-full px-4 h-9">
              Help
            </Button>
          </div>
        </div>
      </div>
      
      <div className="w-full h-[3px] bg-gray-100 relative">
        <div 
          className="h-full bg-[#1E40AF] transition-all duration-300 ease-in-out absolute left-0 top-0"
          style={{ width: progressWidth }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
