import { type FC, type ReactNode, useState } from 'react';

import { LayoutContext } from './context';

interface LayoutProviderProps {
  children: ReactNode;
  onSidebarCollapseChange?: (value: boolean) => void;
  onSidebarEnableChange?: (value: boolean) => void;
  onSidebarExpandOnHoverChange?: (value: boolean) => void;
  onSidebarExtraCollapseChange?: (value: boolean) => void;
  onSidebarExtraVisibleChange?: (value: boolean) => void;
  onSideMouseLeave?: () => void;
  sidebarCollapse: boolean;
  sidebarEnable: boolean;
  sidebarExpandOnHover: boolean;
  sidebarExtraCollapse: boolean;
  sidebarExtraVisible: boolean;
}

export const LayoutProvider: FC<LayoutProviderProps> = ({
  onSidebarCollapseChange,
  onSidebarEnableChange,
  onSidebarExpandOnHoverChange,
  onSidebarExtraCollapseChange,
  onSidebarExtraVisibleChange,
  onSideMouseLeave,
  sidebarCollapse,
  sidebarEnable,
  sidebarExpandOnHover,
  sidebarExtraCollapse,
  sidebarExtraVisible,
  children,
}) => {
  const [sidebarExpandOnHovering, setSidebarExpandOnHovering] = useState(false);

  const handleSidebarCollapseChange = (value: boolean) => {
    onSidebarCollapseChange?.(value);
  };

  const handleSidebarExtraVisibleChange = (value: boolean) => {
    onSidebarExtraVisibleChange?.(value);
  };

  const handleSidebarExtraCollapseChange = (value: boolean) => {
    onSidebarExtraCollapseChange?.(value);
  };

  const handleSidebarExpandOnHoverChange = (value: boolean) => {
    onSidebarExpandOnHoverChange?.(value);
  };

  const handleSidebarEnableChange = (value: boolean) => {
    onSidebarEnableChange?.(value);
  };

  return (
    <LayoutContext.Provider
      value={{
        onSideMouseLeave,
        setSidebarCollapse: handleSidebarCollapseChange,
        setSidebarEnable: handleSidebarEnableChange,
        setSidebarExpandOnHover: handleSidebarExpandOnHoverChange,
        setSidebarExpandOnHovering,
        setSidebarExtraCollapse: handleSidebarExtraCollapseChange,
        setSidebarExtraVisible: handleSidebarExtraVisibleChange,
        sidebarCollapse,
        sidebarEnable,
        sidebarExpandOnHover,
        sidebarExpandOnHovering,
        sidebarExtraCollapse,
        sidebarExtraVisible,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
