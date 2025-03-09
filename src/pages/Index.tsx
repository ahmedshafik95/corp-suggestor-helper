
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CorporateSearch from "@/components/CorporateSearch";
import ProgressBar from "@/components/ProgressBar";
import { Company } from "@/types/company";

const Index = () => {
  const navigate = useNavigate();
  
  const handleCompanySelect = (company: Company) => {
    console.log("Selected company:", company);
    if (company.directors && company.directors.length > 0) {
      console.log("Company directors:", company.directors);
    } else {
      console.log("No directors found for this company");
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <ProgressBar currentStep={2} totalSteps={3} />
      
      <div className="px-4 md:px-6 max-w-5xl mx-auto pb-12 flex-1">
        <div className="flex items-center mb-6">
          <button 
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm ml-[-8px]"
          >
            <ArrowLeft size={16} className="mr-1" />
            <span>Back</span>
          </button>
        </div>
        
        <div className="mb-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">
              Tell us about your company
            </h1>
            
            <p className="text-gray-600 max-w-3xl">
              You'll need the legal name or Corporation number to find your company below. 
              We'll automatically retrieve all the information needed for the next steps.
            </p>
          </div>
          
          <CorporateSearch onCompanySelect={handleCompanySelect} onBack={handleBack} />
        </div>
      </div>
      
      <div className="py-6 border-t border-gray-200 mt-auto bg-white">
        <div className="px-4 md:px-6 max-w-5xl mx-auto">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Canada Business Registry Search. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
