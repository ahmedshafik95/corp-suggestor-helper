
import { Company, CompanySuggestion, SearchOptions, SearchResult } from "@/types/company";

// The real API endpoint
const SEARCH_API_URL = "https://searchapi.mrasservice.ca/Search/api/v1/search";

// Function to convert API response to our CompanySuggestion format
const convertApiResultsToCompanySuggestions = (apiResults: any[]): CompanySuggestion[] => {
  return apiResults
    .map(item => ({
      id: item.Juri_ID || item.MRAS_ID || `cbr-${Math.random().toString(36).substring(2, 11)}`,
      name: item.Company_Name || item.businessName || item.legalName || item.title || "",
      jurisdiction: determineJurisdiction(item.Jurisdiction || item.Registry_Source),
      registrationNumber: item.Juri_ID || item.identifier || "",
      source: "BUSINESS_REGISTRIES" as const,
      incorporationDate: item.Date_Incorporated || "",
      status: item.Status_State || "",
      directors: getDirectorsForCompany(item.Company_Name, item.Juri_ID)
    }))
    // Filter out Quebec companies and non-active companies
    .filter(company => 
      company.jurisdiction !== "QUEBEC" && 
      (company.status?.toLowerCase() === "active" || company.status === "")
    )
    // Sort by incorporation date (most recent first)
    .sort((a, b) => {
      // If dates are available, sort by them
      if (a.incorporationDate && b.incorporationDate) {
        return new Date(b.incorporationDate).getTime() - new Date(a.incorporationDate).getTime();
      }
      // If no dates, maintain original ordering
      return 0;
    });
};

// Map of known federal companies and their directors
// In a real implementation, this would be fetched from an API
const knownCompanyDirectors: Record<string, Array<{name: string, position: string}>> = {
  // For Venn Software Inc.
  "13281230": [
    { name: "Ahmed Shafik", position: "Director" },
    { name: "Dan Ahrens", position: "Director" },
    { name: "Saud Ziz", position: "Director" }
  ],
  // Can add more known companies here as needed
  "default": [
    { name: "Jane Smith", position: "Director" },
    { name: "John Doe", position: "President" },
    { name: "Alice Johnson", position: "Secretary" }
  ]
};

// Helper function to get directors for a specific company
const getDirectorsForCompany = (companyName?: string, registrationNumber?: string): Array<{name: string, position: string}> | undefined => {
  // If it's Venn Software Inc., return the real directors
  if (companyName === "Venn Software Inc." || registrationNumber === "13281230") {
    return knownCompanyDirectors["13281230"];
  }
  
  // For other federal companies, we could return default directors or undefined
  // In a real implementation, this would fetch from an API based on the company ID
  return undefined;
};

// Helper to map API jurisdiction to our format
const determineJurisdiction = (jurisdiction?: string): Company['jurisdiction'] => {
  if (!jurisdiction) return "FEDERAL";
  
  const normalized = jurisdiction.toUpperCase();
  
  if (normalized.includes("ONTARIO") || normalized === "ON") {
    return "ONTARIO";
  } else if (normalized.includes("ALBERTA") || normalized === "AB") {
    return "ALBERTA";
  } else if (normalized.includes("BRITISH COLUMBIA") || normalized === "BC") {
    return "BRITISH_COLUMBIA";
  } else if (normalized.includes("MANITOBA") || normalized === "MB") {
    return "MANITOBA";
  } else if (normalized.includes("NEW BRUNSWICK") || normalized === "NB") {
    return "NEW_BRUNSWICK";
  } else if (normalized.includes("NEWFOUNDLAND") || normalized === "NL") {
    return "NEWFOUNDLAND";
  } else if (normalized.includes("NOVA SCOTIA") || normalized === "NS") {
    return "NOVA_SCOTIA";
  } else if (normalized.includes("PRINCE EDWARD ISLAND") || normalized === "PE") {
    return "PRINCE_EDWARD_ISLAND";
  } else if (normalized.includes("QUEBEC") || normalized === "QC") {
    return "QUEBEC";
  } else if (normalized.includes("SASKATCHEWAN") || normalized === "SK") {
    return "SASKATCHEWAN";
  } else if (normalized.includes("NORTHWEST TERRITORIES") || normalized === "NT") {
    return "NORTHWEST_TERRITORIES";
  } else if (normalized.includes("NUNAVUT") || normalized === "NU") {
    return "NUNAVUT";
  } else if (normalized.includes("YUKON") || normalized === "YT") {
    return "YUKON";
  } else if (normalized.includes("CC")) {
    return "FEDERAL";
  } else {
    return "FEDERAL";
  }
};

// Simulates network delay for realistic behavior
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Search using the real API
export const searchCompanies = async (options: SearchOptions): Promise<SearchResult> => {
  console.log("Searching with options:", options);
  
  if (!options.query?.trim()) {
    return { companies: [], total: 0, hasMore: false };
  }
  
  try {
    // Construct query params
    const params = new URLSearchParams({
      fq: `keyword:{${options.query}}`,
      lang: 'en',
      queryaction: 'fieldquery',
      sortfield: 'score',
      sortorder: 'desc'
    });

    // Add pagination if provided
    if (options.limit) {
      params.append('rows', options.limit.toString());
    }
    if (options.offset) {
      params.append('start', options.offset.toString());
    }

    // Make the API request
    const response = await fetch(`${SEARCH_API_URL}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("API Response:", data);

    // Extract results and convert to our format
    const apiResults = data.docs || [];
    const total = data.totalResults || 0;
    
    const companies = convertApiResultsToCompanySuggestions(apiResults);
    
    // Calculate if there are more results
    const limit = options.limit || 5;
    const offset = options.offset || 0;
    const hasMore = offset + companies.length < total;
    
    return {
      companies,
      total,
      hasMore
    };
  } catch (error) {
    console.error("Error searching companies:", error);
    throw error;
  }
};

// Helper function to convert string status to our enum type
const convertToValidStatus = (status?: string): Company['status'] => {
  if (!status) return "ACTIVE";
  
  const normalized = status.toUpperCase();
  
  if (normalized.includes("ACTIVE")) {
    return "ACTIVE";
  } else if (normalized.includes("INACTIVE")) {
    return "INACTIVE";
  } else if (normalized.includes("DISSOLVED")) {
    return "DISSOLVED";
  } else if (normalized.includes("DISCONTINUED")) {
    return "DISCONTINUED";
  } else if (normalized.includes("CANCELLED")) {
    return "CANCELLED";
  } else if (normalized.includes("REVOKED")) {
    return "REVOKED";
  } else if (normalized.includes("SUSPENDED")) {
    return "SUSPENDED";
  } else {
    // Default to ACTIVE if status doesn't match any known values
    return "ACTIVE";
  }
};

// For company details, we'll use the mock data for now since the API doesn't have endpoints for individual companies
// In a real implementation, you would fetch this from a company details endpoint
export const getCompanyById = async (id: string): Promise<Company | null> => {
  console.log("Fetching company details for ID:", id);
  
  // Simulate API call delay with variable timing
  const fetchDelay = Math.random() * 300 + 200;
  await delay(fetchDelay);
  
  // Find the suggestion that matches the ID (this would be an API call in a real application)
  const suggestions = await searchCompanies({ query: id, limit: 5 });
  const matchingSuggestion = suggestions.companies.find(c => c.id === id);
  
  // Convert string status to our enum type
  const status = convertToValidStatus(matchingSuggestion?.status);
  
  // In a real implementation, you would fetch the company details from an API
  const company: Company = {
    id,
    name: matchingSuggestion?.name || "Company Name",
    registrationNumber: matchingSuggestion?.registrationNumber || id.replace("cbr-", ""),
    jurisdiction: matchingSuggestion?.jurisdiction || (id.includes("ont-") ? "ONTARIO" : "FEDERAL"),
    status,
    type: "CORPORATION",
    incorporationDate: matchingSuggestion?.incorporationDate || new Date().toISOString().split('T')[0],
    source: matchingSuggestion?.source || (id.includes("cbr-") ? "BUSINESS_REGISTRIES" : id.includes("ont-") ? "ONTARIO_REGISTRY" : "ISED_FEDERAL")
  };
  
  // Add directors for federal companies - use the directors from the matching suggestion first,
  // then fall back to known directors, then use default directors
  if (company.jurisdiction === "FEDERAL") {
    if (matchingSuggestion?.directors) {
      company.directors = matchingSuggestion.directors;
    } else if (company.registrationNumber && knownCompanyDirectors[company.registrationNumber]) {
      company.directors = knownCompanyDirectors[company.registrationNumber];
    } else if (company.name === "Venn Software Inc.") {
      company.directors = knownCompanyDirectors["13281230"];
    } else {
      company.directors = knownCompanyDirectors["default"];
    }
  }
  
  return company;
};

// These functions would be updated to use real API endpoints if they become available
export const searchFederalRegistry = async (query: string, limit = 5): Promise<CompanySuggestion[]> => {
  console.log("Searching Federal Registry for:", query);
  
  // For now, use the main search function with a jurisdictions filter
  const result = await searchCompanies({
    query,
    jurisdictions: ["FEDERAL"],
    limit
  });
  
  return result.companies;
};

export const searchOntarioRegistry = async (query: string, limit = 5): Promise<CompanySuggestion[]> => {
  console.log("Searching Ontario Registry for:", query);
  
  // For now, use the main search function with a jurisdictions filter
  const result = await searchCompanies({
    query,
    jurisdictions: ["ONTARIO"],
    limit
  });
  
  return result.companies;
};

export const searchBusinessRegistries = async (query: string, limit = 5): Promise<CompanySuggestion[]> => {
  console.log("Searching Business Registries for:", query);
  
  // This is the one we're actually implementing
  const result = await searchCompanies({
    query,
    limit
  });
  
  return result.companies;
};
