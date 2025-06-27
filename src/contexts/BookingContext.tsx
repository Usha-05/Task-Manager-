
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Booking } from '@/types';

interface BookingContextType {
  bookings: Booking[];
  isLoading: boolean;
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Promise<void>;
  updateBookingStatus: (id: string, status: 'confirmed' | 'rejected') => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;
  getUserBookings: () => Booking[];
  getOwnerBookings: () => Booking[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadBookings();
    } else {
      setBookings([]);
    }
  }, [user]);

  const loadBookings = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const savedBookings = localStorage.getItem('bookings');
      if (savedBookings) {
        const parsedBookings = JSON.parse(savedBookings).map((booking: any) => ({
          ...booking,
          checkIn: new Date(booking.checkIn),
          checkOut: new Date(booking.checkOut),
          createdAt: new Date(booking.createdAt),
        }));
        setBookings(parsedBookings);
      }
    } catch (error) {
      toast({
        title: "Error loading bookings",
        description: "Failed to load bookings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveBookings = (updatedBookings: Booking[]) => {
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
  };

  const createBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const newBooking: Booking = {
        ...bookingData,
        id: Date.now().toString(),
        createdAt: new Date(),
      };

      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedBookings = [...bookings, newBooking];
      setBookings(updatedBookings);
      saveBookings(updatedBookings);
      
      toast({
        title: "Booking request sent",
        description: "Your booking request has been sent to the property owner",
      });
    } catch (error) {
      toast({
        title: "Error creating booking",
        description: "Failed to create booking request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: 'confirmed' | 'rejected') => {
    try {
      setIsLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedBookings = bookings.map(booking =>
        booking.id === id ? { ...booking, status } : booking
      );
      
      setBookings(updatedBookings);
      saveBookings(updatedBookings);
      
      toast({
        title: "Booking updated",
        description: `Booking has been ${status}`,
      });
    } catch (error) {
      toast({
        title: "Error updating booking",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cancelBooking = async (id: string) => {
    await updateBookingStatus(id, 'cancelled' as any);
  };

  const getUserBookings = () => {
    if (!user) return [];
    return bookings.filter(booking => booking.renterId === user.id);
  };

  const getOwnerBookings = () => {
    if (!user) return [];
    // This would need property data to match owner, simplified for demo
    return bookings;
  };

  return (
    <BookingContext.Provider value={{
      bookings,
      isLoading,
      createBooking,
      updateBookingStatus,
      cancelBooking,
      getUserBookings,
      getOwnerBookings,
    }}>
      {children}
    </BookingContext.Provider>
  );
};
