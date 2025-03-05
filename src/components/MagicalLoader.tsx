
import React from "react";
import { Loader2 } from "lucide-react";

interface MagicalLoaderProps {
  message?: string;
}

const MagicalLoader: React.FC<MagicalLoaderProps> = ({ 
  message = "Processing company information..." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-8">
      <div className="relative">
        <div className="w-20 h-20 rounded-full border-4 border-gray-200 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
        <div className="absolute inset-0 w-20 h-20 rounded-full border-t-4 border-primary animate-spin"></div>
      </div>
      
      <div className="space-y-3 text-center">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          {message}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          We're retrieving and preparing all available information
        </p>
      </div>
      
      <div className="flex space-x-1 mt-2">
        <div className="w-3 h-3 rounded-full bg-gray-300 animate-pulse"></div>
        <div className="w-3 h-3 rounded-full bg-gray-400 animate-pulse delay-100"></div>
        <div className="w-3 h-3 rounded-full bg-gray-500 animate-pulse delay-200"></div>
      </div>
    </div>
  );
};

export default MagicalLoader;
