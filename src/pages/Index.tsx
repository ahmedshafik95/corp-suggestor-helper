
import React from "react";
import { useNavigate } from "react-router-dom";
import CorporateSearch from "@/components/CorporateSearch";
import { Company } from "@/types/company";

const Index = () => {
  const navigate = useNavigate();
  
  const handleCompanySelect = (company: Company) => {
    console.log("Selected company:", company);
  };

  return (
    <div className="min-h-screen flex flex-col p-6 md:p-8 lg:p-12 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-4xl w-full mx-auto">
        <CorporateSearch onCompanySelect={handleCompanySelect} />
      </div>
      
      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Canada Business Registry Search. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
