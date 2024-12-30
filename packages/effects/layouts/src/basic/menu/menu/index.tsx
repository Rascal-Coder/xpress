import type { MenuRecordRaw } from '@xpress-core/typings';

import { type MenuProps, MenuView } from '@xpress-core/react-menu';

interface Props extends MenuProps {
  menus: MenuRecordRaw[];
}
function Menu({
  menus = [],
  accordion = true,
  onOpen,
  onSelect,
  ...props
}: Props) {
  return (
    <MenuView
      {...props}
      accordion={accordion}
      menus={menus}
      onOpen={onOpen}
      onSelect={onSelect}
    />
  );
}

export default Menu;
