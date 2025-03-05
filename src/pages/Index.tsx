
import React from "react";
import { useNavigate } from "react-router-dom";
import CorporateSearch from "@/components/CorporateSearch";
import ProgressBar from "@/components/ProgressBar";
import { Company } from "@/types/company";
import { ArrowLeft } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  
  const handleCompanySelect = (company: Company) => {
    console.log("Selected company:", company);
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col p-6 md:p-8 lg:p-12 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-4xl w-full mx-auto">
        <ProgressBar currentStep={2} totalSteps={3} />
        
        <div className="flex items-center mb-8">
          <button 
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            <span>Back</span>
          </button>
        </div>
        
        <h1 className="text-4xl font-bold mb-8">Let's find your company</h1>
        
        <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
          You'll need the legal name or Corporation number to find your company below. 
          We'll automatically retrieve all the information needed for the next steps.
        </p>
        
        <CorporateSearch onCompanySelect={handleCompanySelect} />
      </div>
      
      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Canada Business Registry Search. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
