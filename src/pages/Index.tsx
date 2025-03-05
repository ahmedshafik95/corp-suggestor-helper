
import React from "react";
import { useNavigate } from "react-router-dom";
import CorporateSearch from "@/components/CorporateSearch";
import ProgressBar from "@/components/ProgressBar";
import { Company } from "@/types/company";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        
        <div className="flex flex-col space-y-8">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="p-0 mr-2 hover:bg-transparent"
              onClick={handleBack}
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-4xl font-bold">Let's find your company</h1>
          </div>
          
          <CorporateSearch onCompanySelect={handleCompanySelect} />
        </div>
      </div>
      
      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Canada Business Registry Search. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
