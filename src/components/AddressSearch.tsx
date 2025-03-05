
import React, { useState, useRef, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useDebounce } from '@/hooks/use-debounce';
import { useToast } from "@/components/ui/use-toast";

export interface Address {
  street: string;
  unit?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  fullAddress: string;
}

interface AddressSearchProps {
  onAddressSelect: (address: Address) => void;
  defaultValue?: string;
}

const AddressSearch: React.FC<AddressSearchProps> = ({ onAddressSelect, defaultValue = '' }) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const debouncedQuery = useDebounce(searchQuery, 300);

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 3) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    
    const fetchAddresses = async () => {
      try {
        setIsLoading(true);
        
        // Mapbox geocoding API endpoint with focus on Canada
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(debouncedQuery)}.json?access_token=pk.eyJ1IjoibG92YWJsZWFpIiwiYSI6ImNsdDdsYzVlczBkYTIya3RkbGlha2RkZnQifQ.S4cOXOaUZ0G2PfTxv0qOng&country=ca&limit=5&types=address`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch addresses');
        }
        
        const data = await response.json();
        setResults(data.features || []);
        
        if (data.features.length > 0) {
          setIsOpen(true);
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
        toast({
          title: "Search Error",
          description: "Failed to fetch address suggestions. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAddresses();
  }, [debouncedQuery, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (!value.trim()) {
      setResults([]);
      setIsOpen(false);
    }
    
    if (value.trim() && !isOpen) {
      setIsOpen(true);
    }
  };

  const handleInputFocus = () => {
    if (searchQuery.trim() && results.length > 0) {
      setIsOpen(true);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleAddressSelect = (result: any) => {
    setIsOpen(false);
    
    // Parse address components from Mapbox result
    const { place_name, context, text } = result;
    
    // Extract address components from context array
    const addressComponents = {
      street: text || "",
      unit: "",
      city: context?.find((item: any) => item.id.includes('place'))?.text || "",
      province: context?.find((item: any) => item.id.includes('region'))?.text || "",
      postalCode: context?.find((item: any) => item.id.includes('postcode'))?.text || "",
      country: context?.find((item: any) => item.id.includes('country'))?.text || "Canada",
      fullAddress: place_name
    };
    
    setSearchQuery(place_name);
    onAddressSelect(addressComponents);
  };

  return (
    <div className="w-full relative" ref={containerRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for an address..."
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pl-10"
          aria-label="Search for an address"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        {searchQuery && (
          <button 
            onClick={handleClearSearch}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            aria-label="Clear search"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400 mr-2" />
              <span className="text-gray-500">Searching addresses...</span>
            </div>
          ) : results.length > 0 ? (
            <ul>
              {results.map((result) => (
                <li 
                  key={result.id}
                  className="cursor-pointer hover:bg-gray-50 p-3"
                  onClick={() => handleAddressSelect(result)}
                >
                  <div className="flex items-start">
                    <Search className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-800 font-medium">{result.text}</p>
                      <p className="text-gray-500 text-sm">{result.place_name.replace(result.text + ', ', '')}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : searchQuery.length >= 3 ? (
            <div className="p-3 text-center text-gray-500">
              No addresses found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default AddressSearch;
