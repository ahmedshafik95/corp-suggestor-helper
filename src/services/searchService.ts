
import { Company, CompanySuggestion, SearchOptions, SearchResult } from "@/types/company";

// This is mock data - in a real implementation, this would be fetched from an API
const MOCK_COMPANIES: Company[] = [
  {
    id: "fed-123456789",
    name: "Vault Pay Inc.",
    registrationNumber: "123456789",
    jurisdiction: "FEDERAL",
    status: "ACTIVE",
    type: "CORPORATION",
    incorporationDate: "2020-01-15",
    businessNumber: "987654321RC0001",
    address: {
      street: "150 Elgin Street",
      city: "Ottawa",
      province: "Ontario",
      postalCode: "K2P 1L4"
    },
    directors: [
      { name: "Jane Smith", position: "President" },
      { name: "John Doe", position: "Secretary" }
    ],
    source: "ISED_FEDERAL"
  },
  {
    id: "ont-987654321",
    name: "Vault Payment Solutions Ltd.",
    registrationNumber: "987654321",
    jurisdiction: "ONTARIO",
    status: "ACTIVE",
    type: "CORPORATION",
    incorporationDate: "2018-05-22",
    source: "ONTARIO_REGISTRY"
  },
  {
    id: "fed-456789123",
    name: "Vault Financial Technologies Inc.",
    registrationNumber: "456789123",
    jurisdiction: "ONTARIO",
    status: "ACTIVE",
    type: "CORPORATION",
    incorporationDate: "2019-11-08",
    source: "BUSINESS_REGISTRIES"
  },
  {
    id: "fed-789123456",
    name: "Digital Vault Pay Systems",
    registrationNumber: "789123456",
    jurisdiction: "FEDERAL",
    status: "ACTIVE",
    type: "CORPORATION",
    incorporationDate: "2021-03-17",
    source: "ISED_FEDERAL"
  },
  {
    id: "ont-654321987",
    name: "Secure Vault Payments Corp.",
    registrationNumber: "654321987",
    jurisdiction: "ONTARIO",
    status: "ACTIVE",
    type: "CORPORATION",
    incorporationDate: "2017-09-30",
    source: "ONTARIO_REGISTRY"
  },
  {
    id: "fed-321987654",
    name: "Canadian Payment Vault Ltd.",
    registrationNumber: "321987654",
    jurisdiction: "FEDERAL",
    status: "ACTIVE",
    type: "CORPORATION",
    incorporationDate: "2016-12-05",
    source: "ISED_FEDERAL"
  },
  {
    id: "ont-852963741",
    name: "Ontario Vault Solutions",
    registrationNumber: "852963741",
    jurisdiction: "ONTARIO",
    status: "INACTIVE",
    type: "LIMITED_PARTNERSHIP",
    incorporationDate: "2015-08-11",
    source: "ONTARIO_REGISTRY"
  },
  {
    id: "fed-147258369",
    name: "Federal Vault Enterprises",
    registrationNumber: "147258369",
    jurisdiction: "FEDERAL",
    status: "ACTIVE",
    type: "CORPORATION",
    incorporationDate: "2022-02-28",
    source: "ISED_FEDERAL"
  },
  {
    id: "ont-741852963",
    name: "Eastern Ontario Vault Corporation",
    registrationNumber: "741852963", 
    jurisdiction: "ONTARIO",
    status: "ACTIVE",
    type: "CORPORATION",
    incorporationDate: "2019-06-12",
    source: "ONTARIO_REGISTRY"
  },
  {
    id: "fed-369258147",
    name: "National Vault Services Inc.",
    registrationNumber: "369258147",
    jurisdiction: "FEDERAL",
    status: "ACTIVE",
    type: "CORPORATION",
    incorporationDate: "2020-09-04",
    source: "ISED_FEDERAL"
  },
  {
    id: "fed-951753852",
    name: "Canadian Digital Vault Co.",
    registrationNumber: "951753852",
    jurisdiction: "FEDERAL",
    status: "DISSOLVED",
    type: "CORPORATION",
    incorporationDate: "2017-11-20",
    source: "BUSINESS_REGISTRIES"
  },
  {
    id: "ont-753159852",
    name: "Toronto Vault Technologies",
    registrationNumber: "753159852",
    jurisdiction: "ONTARIO",
    status: "ACTIVE",
    type: "CORPORATION",
    incorporationDate: "2021-01-25",
    source: "ONTARIO_REGISTRY"
  }
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulates searching from multiple registry sources with pagination
export const searchCompanies = async (options: SearchOptions): Promise<SearchResult> => {
  console.log("Searching for:", options);
  
  if (!options.query?.trim()) {
    return { companies: [], total: 0, hasMore: false };
  }
  
  // Simulate API call delay with variable timing to mimic real-world behavior
  const searchDelay = Math.random() * 300 + 200;
  await delay(searchDelay);
  
  const normalizedQuery = options.query.toLowerCase().trim();
  
  // Filter by query and jurisdictions if provided
  let filteredCompanies = MOCK_COMPANIES.filter(company => {
    const nameMatch = company.name.toLowerCase().includes(normalizedQuery);
    const jurisdictionMatch = !options.jurisdictions?.length || 
      options.jurisdictions.includes(company.jurisdiction);
    const statusMatch = !options.statuses?.length || 
      options.statuses.includes(company.status);
    
    return nameMatch && jurisdictionMatch && statusMatch;
  });
  
  // Calculate pagination
  const total = filteredCompanies.length;
  const limit = options.limit || 5;
  const offset = options.offset || 0;
  
  // Get paginated results
  const paginatedResults = filteredCompanies
    .slice(offset, offset + limit)
    .map(({ id, name, jurisdiction, registrationNumber, source }) => ({
      id,
      name,
      jurisdiction,
      registrationNumber,
      source
    }));
  
  // Determine if there are more results
  const hasMore = offset + limit < total;
  
  // Return formatted results
  return {
    companies: paginatedResults,
    total,
    hasMore
  };
};

export const getCompanyById = async (id: string): Promise<Company | null> => {
  console.log("Fetching company details for ID:", id);
  
  // Simulate API call delay with variable timing
  const fetchDelay = Math.random() * 300 + 200;
  await delay(fetchDelay);
  
  // Generate a simulated source-specific response delay
  // In real-world, different registries would have different response times
  if (id.startsWith("fed-")) {
    await delay(100); // Federal registry is faster in this simulation
  } else if (id.startsWith("ont-")) {
    await delay(300); // Ontario registry is slower in this simulation
  }
  
  const company = MOCK_COMPANIES.find(c => c.id === id) || null;
  
  // Simulate occasional error for realistic behavior
  if (Math.random() < 0.05) {
    throw new Error("Registry service temporarily unavailable");
  }
  
  return company;
};

// This function would simulate fetching from the ISED Federal Corporate registry
export const searchFederalRegistry = async (query: string, limit = 5): Promise<CompanySuggestion[]> => {
  console.log("Searching Federal Registry for:", query);
  await delay(350); // Simulate slightly longer delay for this source
  
  return MOCK_COMPANIES
    .filter(company => 
      company.source === "ISED_FEDERAL" && 
      company.name.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, limit)
    .map(({ id, name, jurisdiction, registrationNumber, source }) => ({
      id, name, jurisdiction, registrationNumber, source
    }));
};

// This function would simulate fetching from Ontario's corporate registry
export const searchOntarioRegistry = async (query: string, limit = 5): Promise<CompanySuggestion[]> => {
  console.log("Searching Ontario Registry for:", query);
  await delay(250);
  
  return MOCK_COMPANIES
    .filter(company => 
      company.source === "ONTARIO_REGISTRY" && 
      company.name.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, limit)
    .map(({ id, name, jurisdiction, registrationNumber, source }) => ({
      id, name, jurisdiction, registrationNumber, source
    }));
};

// This function would simulate fetching from Canada's Business Registries
export const searchBusinessRegistries = async (query: string, limit = 5): Promise<CompanySuggestion[]> => {
  console.log("Searching Business Registries for:", query);
  await delay(400); // Simulate longer delay for this source
  
  return MOCK_COMPANIES
    .filter(company => 
      company.source === "BUSINESS_REGISTRIES" && 
      company.name.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, limit)
    .map(({ id, name, jurisdiction, registrationNumber, source }) => ({
      id, name, jurisdiction, registrationNumber, source
    }));
};
