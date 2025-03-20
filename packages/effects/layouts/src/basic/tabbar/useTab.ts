import { useState } from 'react';

export const useTab = () => {
  const [tabs, setTabs] = useState<[]>([]);

  return {
    tabs,
    setTabs,
  };
};
