import type { MenuProps } from '@xpress-core/react-menu';
import type { MenuRecordRaw } from '@xpress-core/typings';

import { MenuView } from '@xpress-core/react-menu';

import { useRouter } from '@tanstack/react-router';

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
  const router = useRouter();
  const currentPath = router.state.location.pathname;

  const handleSelect = async (path: string) => {
    await router.navigate({ to: path });
  };

  return (
    <MenuView
      accordion={accordion}
      collapse={collapse}
      // TODO: Provide activePath
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
