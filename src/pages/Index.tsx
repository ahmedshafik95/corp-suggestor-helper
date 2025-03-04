
import React from "react";
import CorporateSearch from "@/components/CorporateSearch";
import { Company } from "@/types/company";

const Index = () => {
  const handleCompanySelect = (company: Company) => {
    console.log("Selected company:", company);
  };

  return (
    <div className="min-h-screen flex flex-col p-6 md:p-8 lg:p-12">
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
