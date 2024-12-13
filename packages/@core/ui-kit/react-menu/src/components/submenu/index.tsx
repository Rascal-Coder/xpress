import type { SubMenuProps } from '../types';

import { useNamespace } from '@xpress-core/hooks';
import { cn } from '@xpress-core/shared/utils';

// function useMenuStyle(menu?: SubMenuContextType) {
//   const subMenuStyle = useMemo(() => {
//     return {
//       '--menu-level': menu ? (menu?.level ?? 0 + 1) : 0,
//     } as React.CSSProperties;
//   }, [menu]);
//   return subMenuStyle;
// }
function SubMenu({ title, children }: SubMenuProps) {
  const { b } = useNamespace('sub-menu');
  // const nsMenu = useNamespace('menu');
  // const rootMenu = useContext(MenuContext);
  // const subMenu = useContext(SubMenuContext);
  // const subMenuStyle = useMenuStyle(subMenu);

  // const [items, setItems] = useState<MenuContextType['items']>({});
  // const [subMenus, setSubMenus] = useState<MenuContextType['subMenus']>({});
  // const timer = useRef<null | ReturnType<typeof setTimeout>>(null);
  return (
    <li className={cn(b())}>
      <div>icon</div>
      {children}
      {title}
    </li>
  );
}

export default SubMenu;
