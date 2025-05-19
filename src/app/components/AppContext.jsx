// app/context/AppContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export function AppProvider({ children, initialData }) {
  const [allData, setAllData] = useState(initialData);

  return (
    <AppContext value={{ allData }}>
      {children}
    </AppContext>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
