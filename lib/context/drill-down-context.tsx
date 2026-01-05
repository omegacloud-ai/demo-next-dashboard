'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { SalesRecord } from '@/lib/types/sales';

export interface DrillDownFilter {
  type: 'month' | 'region' | 'product' | 'customerType';
  value: string;
  label: string;
}

interface DrillDownContextType {
  filter: DrillDownFilter | null;
  setFilter: (filter: DrillDownFilter | null) => void;
  filteredData: SalesRecord[];
  setFilteredData: (data: SalesRecord[]) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const DrillDownContext = createContext<DrillDownContextType | undefined>(undefined);

export function DrillDownProvider({ children }: { children: ReactNode }) {
  const [filter, setFilter] = useState<DrillDownFilter | null>(null);
  const [filteredData, setFilteredData] = useState<SalesRecord[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DrillDownContext.Provider
      value={{
        filter,
        setFilter,
        filteredData,
        setFilteredData,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </DrillDownContext.Provider>
  );
}

export function useDrillDown() {
  const context = useContext(DrillDownContext);
  if (context === undefined) {
    throw new Error('useDrillDown must be used within a DrillDownProvider');
  }
  return context;
}
