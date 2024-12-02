import type { Dispatch, SetStateAction } from 'react';

import { createContext, useContext } from 'react';

interface XpressLayoutContextProps {
  // 头部隐藏状态
  headerIsHidden: boolean;
  setHeaderIsHidden: Dispatch<SetStateAction<boolean>>;

  setSidebarCollapse: Dispatch<SetStateAction<boolean>>;
  setSidebarEnable: Dispatch<SetStateAction<boolean>>;

  setSidebarExpandOnHover: Dispatch<SetStateAction<boolean>>;
  setSidebarExpandOnHovering: Dispatch<SetStateAction<boolean>>;

  setSidebarExtraCollapse: Dispatch<SetStateAction<boolean>>;
  setSidebarExtraVisible: Dispatch<SetStateAction<boolean>>;

  // 侧边栏状态
  sidebarCollapse: boolean;
  // 侧边栏启用状态
  sidebarEnable: boolean;

  // 侧边栏hover展开状态
  sidebarExpandOnHover: boolean;
  // 侧边栏hover状态
  sidebarExpandOnHovering: boolean;

  // 侧边栏额外内容折叠状态
  sidebarExtraCollapse: boolean;
  // 侧边栏额外内容状态
  sidebarExtraVisible: boolean;
}

const XpressLayoutContext = createContext<undefined | XpressLayoutContextProps>(
  undefined,
);

export const useXpressLayout = () => {
  const context = useContext(XpressLayoutContext);
  if (!context) {
    throw new Error('useXpressLayout must be used within XpressLayoutProvider');
  }
  return context;
};

export const XpressLayoutProvider = XpressLayoutContext.Provider;
