
import React, { useState } from "react";
import { ArrowLeft, Info } from "lucide-react";
import { Company } from "@/types/company";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
      description: "Your company information has been successfully submitted.",
    });
    
    // You can add navigation logic here if needed
  };

  // Check if company has directors
  const hasDirectors = company.directors && company.directors.length > 0;
  console.log("Company directors in form:", company.directors);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <div className="px-6 md:px-8 lg:px-12 pb-12 max-w-4xl mx-auto w-full">
        <div className="flex items-center mb-8">
          <Button 
            onClick={onBack}
            variant="ghost"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Back</span>
          </Button>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Tell us about your business</h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Venn does not perform any credit checks or require personal guarantees
        </p>
        
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-6">
          <div className="flex items-center gap-2 text-sm font-medium text-[#1E40AF] mb-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[#1E40AF]"></div>
            <span>Business Information</span>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="legalName" className="block text-sm font-medium text-gray-700">
                  Business legal name
                </label>
                <Input
                  type="text"
                  id="legalName"
                  name="legalName"
                  value={formData.legalName}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="operatingName" className="block text-sm font-medium text-gray-700">
                  Operating name
                </label>
                <Input
                  type="text"
                  id="operatingName"
                  name="operatingName"
                  value={formData.operatingName}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="corporationNumber" className="block text-sm font-medium text-gray-700">
                  Corporation number
                </label>
                <Input
                  type="text"
                  id="corporationNumber"
                  name="corporationNumber"
                  value={formData.corporationNumber}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="incorporationDate" className="block text-sm font-medium text-gray-700">
                  Date of incorporation
                </label>
                <Input
                  type="date"
                  id="incorporationDate"
                  name="incorporationDate"
                  value={formData.incorporationDate}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                />
              </div>
            </div>
          </form>
        </div>
        
        {hasDirectors && (
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-6">
            <div className="flex items-center gap-2 text-sm font-medium text-[#1E40AF] mb-4">
              <div className="h-1.5 w-1.5 rounded-full bg-[#1E40AF]"></div>
              <span>Company Directors</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info size={16} className="text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>Directors information is retrieved from the official corporate registry.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            <div className="space-y-4">
              {company.directors && company.directors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {company.directors.map((director, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex flex-col">
                        <h3 className="font-medium text-gray-900">{director.name}</h3>
                        {director.position && (
                          <p className="text-sm text-gray-600">{director.position}</p>
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
        
        <Button 
          type="submit" 
          onClick={handleSubmit}
          className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white px-8 py-6 h-auto text-lg font-medium rounded-lg mt-8"
        >
          Continue
        </Button>
      </div>
      
      <footer className="mt-auto py-8 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Canada Business Registry Search. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CompanyInfoForm;
