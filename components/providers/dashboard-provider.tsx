// components/providers/dashboard-provider.tsx

"use client";

import { ReactNode, createContext, useContext, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface DashboardContextType {
  refetchDashboard: () => Promise<void>;
  invalidateQueries: (queryKeys?: string[]) => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const refetchDashboard = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'getStats'] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'getUpcomingLessons'] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'getRecentActivity'] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'getProgress'] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'getNextLesson'] }),
    ]);
  }, [queryClient]);

  const invalidateQueries = useCallback(async (queryKeys?: string[]) => {
    if (queryKeys && queryKeys.length > 0) {
      await Promise.all(
        queryKeys.map(key => 
          queryClient.invalidateQueries({ queryKey: ['dashboard', key] })
        )
      );
    } else {
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  }, [queryClient]);

  return (
    <DashboardContext.Provider value={{ refetchDashboard, invalidateQueries }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
}