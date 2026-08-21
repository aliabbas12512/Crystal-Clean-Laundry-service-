'use client';

import React, { createContext, useContext, useState } from 'react';

interface BookingContextValue {
  isOpen: boolean;
  selectedPackageId: string | null;
  openBooking: (packageId?: string) => void;
  closeBooking: () => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);

  const openBooking = (packageId?: string) => {
    if (packageId) setSelectedPackageId(packageId);
    setIsOpen(true);
  };
  const closeBooking = () => setIsOpen(false);

  return (
    <BookingContext.Provider value={{ isOpen, selectedPackageId, openBooking, closeBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
}
