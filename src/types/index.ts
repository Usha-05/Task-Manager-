
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'owner' | 'renter';
  isApproved?: boolean;
  createdAt: Date;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: 'apartment' | 'house' | 'villa' | 'studio';
  amenities: string[];
  images: string[];
  ownerId: string;
  ownerName: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  renterId: string;
  renterName: string;
  renterEmail: string;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
  message?: string;
  createdAt: Date;
}

export interface PropertyFilters {
  location?: string;
  priceMin?: number;
  priceMax?: number;
  bedrooms?: number;
  bathrooms?: number;
  type?: string;
  amenities?: string[];
}
