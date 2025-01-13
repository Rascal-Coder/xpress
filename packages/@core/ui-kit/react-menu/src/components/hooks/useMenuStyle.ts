import { useMemo } from 'react';

export function useMenuStyle(level = 0) {
  const menuStyle = useMemo(() => {
    return {
      '--menu-level': level + 1,
    } as React.CSSProperties;
  }, [level]);
  return menuStyle;
}
