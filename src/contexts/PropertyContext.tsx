
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Property, PropertyFilters } from '@/types';

interface PropertyContextType {
  properties: Property[];
  isLoading: boolean;
  addProperty: (property: Omit<Property, 'id' | 'ownerId' | 'ownerName' | 'isApproved' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProperty: (id: string, updates: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  approveProperty: (id: string) => Promise<void>;
  getFilteredProperties: (filters: PropertyFilters) => Property[];
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
};

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadProperties();
    } else {
      setProperties([]);
    }
  }, [user]);

  const loadProperties = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const savedProperties = localStorage.getItem('properties');
      if (savedProperties) {
        const parsedProperties = JSON.parse(savedProperties).map((property: any) => ({
          ...property,
          createdAt: new Date(property.createdAt),
          updatedAt: new Date(property.updatedAt),
        }));
        setProperties(parsedProperties);
      } else {
        // Demo properties
        const demoProperties: Property[] = [
          {
            id: '1',
            title: 'Modern Downtown Apartment',
            description: 'Beautiful 2-bedroom apartment in the heart of the city with stunning views.',
            price: 2500,
            location: 'Downtown',
            bedrooms: 2,
            bathrooms: 2,
            area: 1200,
            type: 'apartment',
            amenities: ['WiFi', 'Parking', 'Gym', 'Pool'],
            images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
            ownerId: '2',
            ownerName: 'Property Owner',
            isApproved: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '2',
            title: 'Cozy Suburban House',
            description: 'Family-friendly house with garden and quiet neighborhood.',
            price: 1800,
            location: 'Suburbs',
            bedrooms: 3,
            bathrooms: 2,
            area: 1800,
            type: 'house',
            amenities: ['WiFi', 'Parking', 'Garden', 'Pet-friendly'],
            images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'],
            ownerId: '2',
            ownerName: 'Property Owner',
            isApproved: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];
        setProperties(demoProperties);
        localStorage.setItem('properties', JSON.stringify(demoProperties));
      }
    } catch (error) {
      toast({
        title: "Error loading properties",
        description: "Failed to load properties from server",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveProperties = (updatedProperties: Property[]) => {
    localStorage.setItem('properties', JSON.stringify(updatedProperties));
  };

  const addProperty = async (propertyData: Omit<Property, 'id' | 'ownerId' | 'ownerName' | 'isApproved' | 'createdAt' | 'updatedAt'>) => {
    if (!user || user.role !== 'owner') return;
    
    try {
      setIsLoading(true);
      
      const newProperty: Property = {
        ...propertyData,
        id: Date.now().toString(),
        ownerId: user.id,
        ownerName: user.name,
        isApproved: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedProperties = [...properties, newProperty];
      setProperties(updatedProperties);
      saveProperties(updatedProperties);
      
      toast({
        title: "Property added",
        description: "Your property has been submitted for approval",
      });
    } catch (error) {
      toast({
        title: "Error adding property",
        description: "Failed to add property",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProperty = async (id: string, updates: Partial<Property>) => {
    try {
      setIsLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedProperties = properties.map(property =>
        property.id === id
          ? { ...property, ...updates, updatedAt: new Date() }
          : property
      );
      
      setProperties(updatedProperties);
      saveProperties(updatedProperties);
      
      toast({
        title: "Property updated",
        description: "Property has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error updating property",
        description: "Failed to update property",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      setIsLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedProperties = properties.filter(property => property.id !== id);
      setProperties(updatedProperties);
      saveProperties(updatedProperties);
      
      toast({
        title: "Property deleted",
        description: "Property has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error deleting property",
        description: "Failed to delete property",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const approveProperty = async (id: string) => {
    if (!user || user.role !== 'admin') return;
    
    await updateProperty(id, { isApproved: true });
  };

  const getFilteredProperties = (filters: PropertyFilters) => {
    return properties.filter(property => {
      if (!property.isApproved) return false;
      
      if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      
      if (filters.priceMin && property.price < filters.priceMin) {
        return false;
      }
      
      if (filters.priceMax && property.price > filters.priceMax) {
        return false;
      }
      
      if (filters.bedrooms && property.bedrooms < filters.bedrooms) {
        return false;
      }
      
      if (filters.bathrooms && property.bathrooms < filters.bathrooms) {
        return false;
      }
      
      if (filters.type && property.type !== filters.type) {
        return false;
      }
      
      return true;
    });
  };

  return (
    <PropertyContext.Provider value={{
      properties,
      isLoading,
      addProperty,
      updateProperty,
      deleteProperty,
      approveProperty,
      getFilteredProperties,
    }}>
      {children}
    </PropertyContext.Provider>
  );
};
