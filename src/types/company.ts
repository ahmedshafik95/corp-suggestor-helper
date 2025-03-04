
export interface Company {
  id: string;
  name: string;
  registrationNumber: string;
  jurisdiction: 'ONTARIO' | 'FEDERAL';
  status: 'ACTIVE' | 'INACTIVE' | 'DISSOLVED';
  type: 'CORPORATION' | 'LIMITED_PARTNERSHIP' | 'SOLE_PROPRIETORSHIP' | 'OTHER';
  incorporationDate: string;
  address?: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
}

export type CompanySuggestion = Pick<Company, 'id' | 'name' | 'jurisdiction' | 'registrationNumber'>;
