import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Company } from "@/types/company";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import AddressSearch, { Address } from "./AddressSearch";
import ProgressBar from "./ProgressBar";

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
    street: company.address?.street || "",
    unit: "",
    city: company.address?.city || "",
    country: company.address?.province === "QUEBEC" ? "Canada" : "Canada",
    postalCode: company.address?.postalCode || "",
    province: company.address?.province.replace(/_/g, " ") || "",
    fullAddress: ""
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
    <div className="w-full max-w-4xl mx-auto">
      <ProgressBar currentStep={3} totalSteps={3} />
      
      <div className="mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          <span>Back</span>
        </button>
      </div>
      
      <h1 className="text-4xl font-bold mb-6">Company information</h1>
      
      <p className="text-lg text-gray-600 mb-8">
        Venn does not perform any credit checks or require personal guarantees
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="legalName" className="block text-sm font-medium text-gray-700">
              Business legal name
            </label>
            <input
              type="text"
              id="legalName"
              name="legalName"
              value={formData.legalName}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="operatingName" className="block text-sm font-medium text-gray-700">
              Operating name
            </label>
            <input
              type="text"
              id="operatingName"
              name="operatingName"
              value={formData.operatingName}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="corporationNumber" className="block text-sm font-medium text-gray-700">
            Corporation number
          </label>
          <input
            type="text"
            id="corporationNumber"
            name="corporationNumber"
            value={formData.corporationNumber}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="incorporationDate" className="block text-sm font-medium text-gray-700">
            Date of incorporation
          </label>
          <input
            type="date"
            id="incorporationDate"
            name="incorporationDate"
            value={formData.incorporationDate}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
              Unit / floor number
            </label>
            <input
              type="text"
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
              Postal Code
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="province" className="block text-sm font-medium text-gray-700">
              Province
            </label>
            <input
              type="text"
              id="province"
              name="province"
              value={formData.province}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
  );
};

export default CompanyInfoForm;
