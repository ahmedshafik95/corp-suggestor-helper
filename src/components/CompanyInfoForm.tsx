
import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Company } from "@/types/company";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import AddressSearch, { Address } from "./AddressSearch";
import ProgressBar from "./ProgressBar";

interface CompanyInfoFormProps {
  company: Company;
  onBack: () => void;
}

const CompanyInfoForm: React.FC<CompanyInfoFormProps> = ({ company, onBack }) => {
  const { toast } = useToast();
  
  // Parse province from API data to make it more readable
  const formatProvince = (province: string): string => {
    if (!province) return "";
    
    // Remove underscores and capitalize first letter of each word
    return province.replace(/_/g, " ")
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };
  
  // Extract city from address or from Reg_office_city in the API response
  const getCity = (): string => {
    if (company.address?.city) return company.address.city;
    
    // The city might be in the Reg_office_city from the API
    const apiData = (company as any)._apiData;
    if (apiData?.Reg_office_city) return apiData.Reg_office_city;
    
    return "";
  };
  
  // Extract address details from API data
  const parseAddressFromCompany = (): {
    street: string;
    city: string;
    province: string;
    postalCode: string;
  } => {
    return {
      street: company.address?.street || "",
      city: getCity(),
      province: formatProvince(company.address?.province || company.jurisdiction || ""),
      postalCode: company.address?.postalCode || ""
    };
  };
  
  const addressData = parseAddressFromCompany();
  
  // Initialize form state with company data
  const [formData, setFormData] = useState({
    legalName: company.name || "",
    operatingName: "",
    corporationNumber: company.registrationNumber || "",
    incorporationDate: company.incorporationDate ? new Date(company.incorporationDate).toISOString().split('T')[0] : "",
    street: addressData.street || "",
    unit: "",
    city: addressData.city || "",
    country: "Canada",
    postalCode: addressData.postalCode || "",
    province: addressData.province || "",
    fullAddress: `${addressData.street}, ${addressData.city}, ${addressData.province}, Canada`
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressSelect = (address: Address) => {
    setFormData(prev => ({
      ...prev,
      street: address.street,
      unit: address.unit || "",
      city: address.city,
      province: address.province,
      postalCode: address.postalCode,
      country: address.country,
      fullAddress: address.fullAddress
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

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <ProgressBar currentStep={3} totalSteps={3} />
      
      <div className="px-6 md:px-8 lg:px-12 pb-12 max-w-4xl mx-auto w-full">
        <div className="flex items-center mb-8">
          <button 
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            <span>Back</span>
          </button>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Tell us about your business</h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Venn does not perform any credit checks or require personal guarantees
        </p>
        
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
          
          <div className="space-y-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Search address
            </label>
            <AddressSearch 
              onAddressSelect={handleAddressSelect} 
              defaultValue={formData.fullAddress}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                Street
              </label>
              <Input
                type="text"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                Unit / floor number
              </label>
              <Input
                type="text"
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <Input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <Input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                Postal Code
              </label>
              <Input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="province" className="block text-sm font-medium text-gray-700">
                Province
              </label>
              <Input
                type="text"
                id="province"
                name="province"
                value={formData.province}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white px-8 py-4 h-auto text-lg font-medium rounded-lg mt-8"
          >
            Continue
          </Button>
        </form>
      </div>
      
      <footer className="mt-auto py-8 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Canada Business Registry Search. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CompanyInfoForm;
