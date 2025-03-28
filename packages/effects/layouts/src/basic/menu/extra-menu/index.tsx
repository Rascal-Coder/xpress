import type { MenuProps } from '@xpress-core/react-menu';
import type { MenuRecordRaw } from '@xpress-core/typings';

import { MenuView } from '@xpress-core/react-menu';
import { useLocation, useNavigate } from '@xpress-core/router';

interface ExtraMenuProps extends Omit<MenuProps, 'children'> {
  collapse?: boolean;
  menus: MenuRecordRaw[];
  accordion?: boolean;
  rounded?: boolean;
}

const ExtraMenu = ({
  accordion = true,
  menus = [],
  collapse,
  rounded,
  theme,
  ...props
}: ExtraMenuProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleSelect = (path: string) => {
    navigate(path);
  };

  return (
    <MenuView
      {...props}
      accordion={accordion}
      collapse={collapse}
      defaultActive={currentPath}
      menus={menus}
      mode="vertical"
      onSelect={handleSelect}
      rounded={rounded}
      theme={theme}
    />
  );
};

export default ExtraMenu;
