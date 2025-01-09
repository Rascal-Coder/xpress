import type { MenuProps } from '@xpress-core/react-menu';
import type { MenuRecordRaw } from '@xpress-core/typings';

import { MenuView } from '@xpress-core/react-menu';

import { useLocation, useNavigate } from 'react-router-dom';

interface ExtraMenuProps extends MenuProps {
  collapse?: boolean;
  menus: MenuRecordRaw[];
  accordion?: boolean;
  rounded?: boolean;
}

const ExtraMenu: React.FC<ExtraMenuProps> = ({
  accordion = true,
  menus = [],
  collapse,
  rounded,
  theme,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleSelect = (path: string) => {
    navigate(path);
  };

  return (
    <MenuView
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
