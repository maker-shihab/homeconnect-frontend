// types.ts
export interface PropertyFormData {
  // Basic Information
  title: string;
  description: string;
  listingType: 'rent' | 'sale';
  propertyType: 'apartment' | 'house' | 'condo' | 'villa' | 'townhouse' | 'studio' | 'land' | 'commercial';

  // Location
  address: string;
  city: string;
  neighborhood: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  zipCode?: string;

  // Specifications
  bedrooms: number;
  bathrooms: number;
  areaSize: number;
  areaUnit: 'sqft' | 'sqm' | 'acres' | 'hectares';
  floor?: number;
  totalFloors?: number;
  yearBuilt?: number;
  lotSize?: number;
  lotUnit?: 'sqft' | 'sqm' | 'acres' | 'hectares';

  // Features
  amenities: string[];
  tags: string[];
  images: string[];
  // Rental Specific
  rentPrice?: number;
  securityDeposit?: number;
  utilityDeposit?: number;
  maintenanceFee?: number;
  minimumStay?: number;
  maximumStay?: number;
  availableFrom: string;
  leaseDuration?: number;
  isFurnished: boolean;
  utilitiesIncluded: string[];
  petPolicy: 'allowed' | 'not-allowed' | 'case-by-case';
  smokingPolicy: 'allowed' | 'not-allowed';

  // Sale Specific
  salePrice?: number;
  originalPrice?: number;
  priceNegotiable: boolean;
  mortgageAvailable: boolean;
  propertyCondition: 'excellent' | 'good' | 'needs-renovation' | 'new-construction';
  ownershipType: 'freehold' | 'leasehold' | 'condominium';
  hoaFee?: number;
  hoaFrequency?: 'monthly' | 'quarterly' | 'yearly';
  taxAmount?: number;
  taxYear?: number;
}

export interface FormErrors {
  [key: string]: string;
}

export const initialFormData: PropertyFormData = {
  // Basic Information
  title: '',
  description: '',
  listingType: 'rent',
  propertyType: 'apartment',

  // Location
  address: '',
  city: '',
  neighborhood: '',
  state: '',
  country: 'Bangladesh',
  latitude: 0,
  longitude: 0,
  zipCode: '',

  // Specifications
  bedrooms: 0,
  bathrooms: 0,
  areaSize: 0,
  areaUnit: 'sqft',

  // Features
  amenities: [],
  tags: [],
  images: [], // Add this line

  // Rental Specific (defaults)
  availableFrom: new Date().toISOString().split('T')[0],
  isFurnished: false,
  utilitiesIncluded: [],
  petPolicy: 'not-allowed',
  smokingPolicy: 'not-allowed',
  minimumStay: 12,

  // Sale Specific (defaults)
  priceNegotiable: true,
  mortgageAvailable: false,
  propertyCondition: 'good',
  ownershipType: 'freehold'
};

// Constants
export const propertyTypes = [
  'apartment', 'house', 'condo', 'villa', 'townhouse', 'studio', 'land', 'commercial'
];

export const bangladeshCities = [
  'Dhaka', 'Chittagong', 'Khulna', 'Rajshahi', 'Sylhet', 'Barisal', 'Rangpur', 'Mymensingh'
];

export const states = [
  'Dhaka Division', 'Chittagong Division', 'Khulna Division', 'Rajshahi Division',
  'Sylhet Division', 'Barisal Division', 'Rangpur Division', 'Mymensingh Division'
];

export const amenitiesList = [
  'Swimming Pool', 'Gym', 'Parking', 'Security', 'Elevator', 'Garden', 'Balcony',
  'Air Conditioning', 'Heating', 'Laundry', 'Internet', 'Cable TV', 'Pet Friendly'
];