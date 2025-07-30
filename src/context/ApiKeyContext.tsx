'use client';

import { createContext, useContext, ReactNode } from 'react';

interface ApiKeyContextType {
  apiKey: string | null;
  setApiKey: (key: string) => void;
}

export const ApiKeyContext = createContext<ApiKeyContextType>({
  apiKey: null,
  setApiKey: () => {},
});

export const useApiKey = () => useContext(ApiKeyContext);

export function ApiKeyProvider({ children, value }: { children: ReactNode; value: ApiKeyContextType }) {
  return (
    <ApiKeyContext.Provider value={value}>
      {children}
    </ApiKeyContext.Provider>
  );
}
