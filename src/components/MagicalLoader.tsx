
import React from "react";

interface MagicalLoaderProps {
  message?: string;
}

const MagicalLoader: React.FC<MagicalLoaderProps> = ({ 
  message = "Processing company information..." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-8">
      <div className="relative">
        <div 
          className="w-20 h-20 rounded-full border-4 border-gray-200 animate-spin"
        />
        <div 
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
      
      <div className="flex flex-col gap-3 text-center">
        <h3 className="text-xl font-semibold text-gray-800">
          {message}
        </h3>
        <p className="text-gray-500 max-w-md">
          We're retrieving and preparing all available information
        </p>
      </div>
      
      <div className="flex gap-1 mt-2">
        <div 
          className="w-[3px] h-[3px] rounded-full bg-gray-300 animate-pulse"
        />
        <div 
          className="w-[3px] h-[3px] rounded-full bg-gray-400 animate-pulse delay-100"
          style={{ animationDelay: "0.1s" }}
        />
        <div 
          className="w-[3px] h-[3px] rounded-full bg-gray-500 animate-pulse delay-200"
          style={{ animationDelay: "0.2s" }}
        />
      </div>
    </div>
  );
};

export default MagicalLoader;
