
export interface Company {
  id: string;
  name: string;
  registrationNumber: string;
  jurisdiction: 'ONTARIO' | 'FEDERAL' | 'ALBERTA' | 'BRITISH_COLUMBIA' | 'MANITOBA' | 'NEW_BRUNSWICK' | 'NEWFOUNDLAND' | 'NOVA_SCOTIA' | 'PRINCE_EDWARD_ISLAND' | 'QUEBEC' | 'SASKATCHEWAN' | 'NORTHWEST_TERRITORIES' | 'NUNAVUT' | 'YUKON';
  status: 'ACTIVE' | 'INACTIVE' | 'DISSOLVED' | 'DISCONTINUED' | 'CANCELLED' | 'REVOKED' | 'SUSPENDED';
  type: 'CORPORATION' | 'LIMITED_PARTNERSHIP' | 'SOLE_PROPRIETORSHIP' | 'OTHER' | 'COOPERATIVE' | 'PARTNERSHIP' | 'LIMITED_LIABILITY_COMPANY' | 'NON_PROFIT';
  incorporationDate: string;
  businessNumber?: string; // CRA Business Number (where available)
  address?: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
  directors?: {
    name: string;
    position?: string;
  }[];
  source: 'ISED_FEDERAL' | 'ONTARIO_REGISTRY' | 'BUSINESS_REGISTRIES'; // Track which registry the data came from
}

export type CompanySuggestion = Pick<Company, 'id' | 'name' | 'jurisdiction' | 'registrationNumber' | 'source'>;

export interface SearchOptions {
  query: string;
  jurisdictions?: Company['jurisdiction'][];
  statuses?: Company['status'][];
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  companies: CompanySuggestion[];
  total: number;
  hasMore: boolean;
}
