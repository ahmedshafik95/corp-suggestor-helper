
import { Company, CompanySuggestion } from "@/types/company";

// This is mock data - in a real implementation, this would be fetched from an API
const MOCK_COMPANIES: Company[] = [
  {
    id: "1",
    name: "Vault Pay Inc.",
    registrationNumber: "123456789",
    jurisdiction: "ONTARIO",
    status: "ACTIVE",
    type: "CORPORATION",
    incorporationDate: "2020-01-15"
  },
  {
    id: "2",
    name: "Vault Payment Solutions Ltd.",
    registrationNumber: "987654321",
    jurisdiction: "FEDERAL",
    status: "ACTIVE",
    type: "CORPORATION",
    incorporationDate: "2018-05-22"
  },
  {
    id: "3",
    name: "Vault Financial Technologies Inc.",
    registrationNumber: "456789123",
    jurisdiction: "ONTARIO",
    status: "ACTIVE",
    type: "CORPORATION",
    incorporationDate: "2019-11-08"
  },
  {
    id: "4",
    name: "Digital Vault Pay Systems",
    registrationNumber: "789123456",
    jurisdiction: "FEDERAL",
    status: "ACTIVE",
    type: "CORPORATION",
    incorporationDate: "2021-03-17"
  },
  {
    id: "5",
    name: "Secure Vault Payments Corp.",
    registrationNumber: "654321987",
    jurisdiction: "ONTARIO",
    status: "ACTIVE",
    type: "CORPORATION",
    incorporationDate: "2017-09-30"
  },
  {
    id: "6",
    name: "Canadian Payment Vault Ltd.",
    registrationNumber: "321987654",
    jurisdiction: "FEDERAL",
    status: "ACTIVE",
    type: "CORPORATION",
    incorporationDate: "2016-12-05"
  },
  {
    id: "7",
    name: "Ontario Vault Solutions",
    registrationNumber: "852963741",
    jurisdiction: "ONTARIO",
    status: "INACTIVE",
    type: "LIMITED_PARTNERSHIP",
    incorporationDate: "2015-08-11"
  },
  {
    id: "8",
    name: "Federal Vault Enterprises",
    registrationNumber: "147258369",
    jurisdiction: "FEDERAL",
    status: "ACTIVE",
    type: "CORPORATION",
    incorporationDate: "2022-02-28"
  }
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const searchCompanies = async (query: string): Promise<CompanySuggestion[]> => {
  console.log("Searching for:", query);
  
  if (!query.trim()) {
    return [];
  }
  
  // Simulate API call delay
  await delay(Math.random() * 300 + 200);
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return MOCK_COMPANIES
    .filter(company => company.name.toLowerCase().includes(normalizedQuery))
    .slice(0, 5)
    .map(({ id, name, jurisdiction, registrationNumber }) => ({
      id,
      name,
      jurisdiction,
      registrationNumber
    }));
};

export const getCompanyById = async (id: string): Promise<Company | null> => {
  console.log("Fetching company details for ID:", id);
  
  // Simulate API call delay
  await delay(Math.random() * 300 + 200);
  
  const company = MOCK_COMPANIES.find(c => c.id === id) || null;
  return company;
};
