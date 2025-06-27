
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Bed, Bath, Square, Calendar } from 'lucide-react';
import { Property } from '@/types';

interface PropertyCardProps {
  property: Property;
  onBook?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onApprove?: () => void;
  showActions?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onBook,
  onEdit,
  onDelete,
  onApprove,
  showActions = false
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-video bg-gray-200 relative overflow-hidden">
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
        
        <div className="absolute top-4 right-4">
          <Badge variant={property.isApproved ? "default" : "secondary"}>
            {property.isApproved ? "Approved" : "Pending"}
          </Badge>
        </div>
        
        <div className="absolute bottom-4 left-4">
          <Badge variant="outline" className="bg-white">
            {property.type}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
            {property.title}
          </h3>
          <div className="text-right">
            <span className="text-2xl font-bold text-blue-600">${property.price}</span>
            <span className="text-gray-500 text-sm">/month</span>
          </div>
        </div>
        
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {property.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span>{property.bedrooms} beds</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span>{property.bathrooms} baths</span>
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            <span>{property.area} sqft</span>
          </div>
        </div>
        
        {property.amenities && property.amenities.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {property.amenities.slice(0, 3).map((amenity, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {property.amenities.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{property.amenities.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        <div className="text-xs text-gray-500 mb-4">
          Owner: {property.ownerName}
        </div>
        
        {showActions && (
          <div className="flex gap-2">
            {onBook && (
              <Button onClick={onBook} className="flex-1">
                <Calendar className="h-4 w-4 mr-2" />
                Book Now
              </Button>
            )}
            {onEdit && (
              <Button onClick={onEdit} variant="outline" size="sm">
                Edit
              </Button>
            )}
            {onDelete && (
              <Button onClick={onDelete} variant="destructive" size="sm">
                Delete
              </Button>
            )}
            {onApprove && !property.isApproved && (
              <Button onClick={onApprove} variant="default" size="sm">
                Approve
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
