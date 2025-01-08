import { useContext, useMemo } from 'react';

import { MenuContext } from './contexts';

export const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenuContext must be used within a MenuProvider');
  }
  return context;
};

export function useMenuStyle(level = 0) {
  const subMenuStyle = useMemo(() => {
    return {
      '--menu-level': level + 1,
    } as React.CSSProperties;
  }, [level]);
  return subMenuStyle;
}
