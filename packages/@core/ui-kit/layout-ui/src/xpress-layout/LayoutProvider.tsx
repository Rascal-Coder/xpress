import { type FC, type ReactNode, useState } from 'react';

import { LayoutContext } from './context';

interface LayoutProviderProps {
  children: ReactNode;
  defaultSidebarCollapse?: boolean;
  defaultSidebarEnable?: boolean;
  defaultSidebarExpandOnHover?: boolean;
  defaultSidebarExtraCollapse?: boolean;
  defaultSidebarExtraVisible?: boolean;
  onSidebarCollapseChange?: (value: boolean) => void;
  onSidebarEnableChange?: (value: boolean) => void;
  onSidebarExpandOnHoverChange?: (value: boolean) => void;
  onSidebarExtraCollapseChange?: (value: boolean) => void;
  onSidebarExtraVisibleChange?: (value: boolean) => void;
  onSideMouseLeave?: () => void;
}

export const LayoutProvider: FC<LayoutProviderProps> = ({
  defaultSidebarCollapse = true,
  defaultSidebarEnable = true,
  defaultSidebarExpandOnHover = false,
  defaultSidebarExtraCollapse = false,
  defaultSidebarExtraVisible = false,
  onSidebarCollapseChange,
  onSidebarEnableChange,
  onSidebarExpandOnHoverChange,
  onSidebarExtraCollapseChange,
  onSidebarExtraVisibleChange,
  onSideMouseLeave,
  children,
}) => {
  const [sidebarCollapse, setSidebarCollapse] = useState(
    defaultSidebarCollapse,
  );
  const [sidebarExtraVisible, setSidebarExtraVisible] = useState(
    defaultSidebarExtraVisible,
  );
  const [sidebarExtraCollapse, setSidebarExtraCollapse] = useState(
    defaultSidebarExtraCollapse,
  );
  const [sidebarExpandOnHover, setSidebarExpandOnHover] = useState(
    defaultSidebarExpandOnHover,
  );
  const [sidebarEnable, setSidebarEnable] = useState(defaultSidebarEnable);
  const [sidebarExpandOnHovering, setSidebarExpandOnHovering] = useState(false);

  const handleSidebarCollapseChange = (value: boolean) => {
    setSidebarCollapse(value);
    onSidebarCollapseChange?.(value);
  };

  const handleSidebarExtraVisibleChange = (value: boolean) => {
    setSidebarExtraVisible(value);
    onSidebarExtraVisibleChange?.(value);
  };

  const handleSidebarExtraCollapseChange = (value: boolean) => {
    setSidebarExtraCollapse(value);
    onSidebarExtraCollapseChange?.(value);
  };

  const handleSidebarExpandOnHoverChange = (value: boolean) => {
    setSidebarExpandOnHover(value);
    onSidebarExpandOnHoverChange?.(value);
  };

  const handleSidebarEnableChange = (value: boolean) => {
    setSidebarEnable(value);
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
