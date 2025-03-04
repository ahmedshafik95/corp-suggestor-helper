
import React from "react";
import CorporateSearch from "@/components/CorporateSearch";
import { Company } from "@/types/company";

const Index = () => {
  const handleCompanySelect = (company: Company) => {
    console.log("Selected company:", company);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-2">
            Canada Business Registry
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Find Canadian Companies
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Search for businesses and corporations across Canada's business registries.
          </p>
        </div>

        <CorporateSearch onCompanySelect={handleCompanySelect} />

        <div className="glass-panel rounded-xl p-6 md:p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">How to use this tool</h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="space-y-2">
              <div className="bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center text-primary font-medium">1</div>
              <h3 className="font-medium">Start Typing</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Enter a company name in the search field above.
              </p>
            </div>
            <div className="space-y-2">
              <div className="bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center text-primary font-medium">2</div>
              <h3 className="font-medium">Select from Results</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Choose from the dropdown of matching company names.
              </p>
            </div>
            <div className="space-y-2">
              <div className="bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center text-primary font-medium">3</div>
              <h3 className="font-medium">View Company Details</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                See registration information and corporate details.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Canada Business Registry Search. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
