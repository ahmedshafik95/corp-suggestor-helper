
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
    <div className="flex flex-col min-h-screen bg-white">
      <ProgressBar currentStep={2} totalSteps={3} />
      
      <div className="container px-4 md:px-6 max-w-5xl mx-auto pb-12">
        <div className="flex items-center mb-6">
          <Button 
            onClick={handleBack}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900 -ml-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
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
      
      <footer className="py-6 border-t border-gray-100">
        <div className="container px-4 md:px-6 max-w-5xl mx-auto">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Canada Business Registry Search. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
