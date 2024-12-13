import { createContext, useContext } from 'react';

interface LayoutContextType {
  onSideMouseLeave?: () => void;
  setSidebarCollapse: (value: boolean) => void;
  setSidebarEnable: (value: boolean) => void;
  setSidebarExpandOnHover: (value: boolean) => void;
  setSidebarExtraCollapse: (value: boolean) => void;
  setSidebarExtraVisible: (value: boolean) => void;
  sidebarCollapse: boolean;
  sidebarEnable: boolean;
  sidebarExpandOnHover: boolean;
  sidebarExtraCollapse: boolean;
  sidebarExtraVisible: boolean;
}

export const LayoutContext = createContext<LayoutContextType | undefined>(
  undefined,
);

export const useLayoutContext = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayoutContext must be used within a LayoutProvider');
  }
  return context;
};
