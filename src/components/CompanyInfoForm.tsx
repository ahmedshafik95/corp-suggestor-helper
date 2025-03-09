
import React, { useState } from "react";
import { ArrowLeft, Info } from "lucide-react";
import { Company } from "@/types/company";
import { useToast } from "@/hooks/use-toast";

interface CompanyInfoFormProps {
  company: Company;
  onBack: () => void;
}

const CompanyInfoForm: React.FC<CompanyInfoFormProps> = ({ company, onBack }) => {
  const { toast } = useToast();
  
  // Initialize form state with company data
  const [formData, setFormData] = useState({
    legalName: company.name || "",
    operatingName: "",
    corporationNumber: company.registrationNumber || "",
    incorporationDate: company.incorporationDate ? new Date(company.incorporationDate).toISOString().split('T')[0] : "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send the data to your backend
    console.log("Submitting company information:", formData);
    
    toast({
      title: "Information Submitted",
      description: "Your company information has been successfully submitted."
    });
    
    // You can add navigation logic here if needed
  };

  // Check if company has directors
  const hasDirectors = company.directors && company.directors.length > 0;
  console.log("Company directors in form:", company.directors);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="px-6 md:px-8 lg:px-12 pb-12 max-w-4xl mx-auto w-full">
        <div className="flex items-center mb-8">
          <button 
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2 transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Tell us about your business
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Venn does not perform any credit checks or require personal guarantees
        </p>
        
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-6">
          <div className="flex items-center gap-2 text-sm font-medium text-blue-700 mb-2">
            <div className="h-[1.5px] w-[1.5px] rounded-full bg-blue-700"></div>
            <span>Business Information</span>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div>
                  <div className="flex flex-col">
                    <label htmlFor="legalName" className="text-sm font-medium text-gray-700 mb-1">
                      Business legal name
                    </label>
                    <input
                      type="text"
                      id="legalName"
                      name="legalName"
                      value={formData.legalName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex flex-col">
                    <label htmlFor="operatingName" className="text-sm font-medium text-gray-700 mb-1">
                      Operating name
                    </label>
                    <input
                      type="text"
                      id="operatingName"
                      name="operatingName"
                      value={formData.operatingName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div>
                  <div className="flex flex-col">
                    <label htmlFor="corporationNumber" className="text-sm font-medium text-gray-700 mb-1">
                      Corporation number
                    </label>
                    <input
                      type="text"
                      id="corporationNumber"
                      name="corporationNumber"
                      value={formData.corporationNumber}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex flex-col">
                    <label htmlFor="incorporationDate" className="text-sm font-medium text-gray-700 mb-1">
                      Date of incorporation
                    </label>
                    <input
                      type="date"
                      id="incorporationDate"
                      name="incorporationDate"
                      value={formData.incorporationDate}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        
        {hasDirectors && (
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-6">
            <div className="flex items-center gap-2 text-sm font-medium text-blue-700 mb-4">
              <div className="h-[1.5px] w-[1.5px] rounded-full bg-blue-700"></div>
              <span>Company Directors</span>
              <div className="cursor-help" title="Directors information is retrieved from the official corporate registry.">
                <Info size={16} className="text-gray-400" />
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              {company.directors && company.directors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {company.directors.map((director, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex flex-col">
                        <div className="font-medium text-gray-900">{director.name}</div>
                        {director.position && (
                          <div className="text-sm text-gray-600">{director.position}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center text-gray-500">
                  <p>No director information available for this company.</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        <button 
          type="submit" 
          onClick={handleSubmit}
          className="w-full bg-gray-900 hover:bg-gray-700 text-white px-8 py-6 h-auto text-lg font-medium rounded-lg mt-8 transition-colors"
        >
          Continue
        </button>
      </div>
      
      <div className="mt-auto py-8 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Canada Business Registry Search. All rights reserved.</p>
      </div>
    </div>
  );
};

export default CompanyInfoForm;
