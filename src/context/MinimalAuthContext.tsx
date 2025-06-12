
import React, { createContext, useContext } from 'react';

interface MinimalAuthContextType {
  user: null;
  role: null;
  loading: boolean;
}

const MinimalAuthContext = createContext<MinimalAuthContextType | undefined>(undefined);

export const useAuth = (): MinimalAuthContextType => {
  const context = useContext(MinimalAuthContext);
  if (context === undefined) {
    // Return default values when no provider is present
    return {
      user: null,
      role: null,
      loading: false
    };
  }
  return context;
};

export const MinimalAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = {
    user: null,
    role: null,
    loading: false
  };

  return (
    <MinimalAuthContext.Provider value={value}>
      {children}
    </MinimalAuthContext.Provider>
  );
};
