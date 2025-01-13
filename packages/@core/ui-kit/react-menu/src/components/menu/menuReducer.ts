/**
 * MenuAction 类型定义了菜单状态更新的所有可能操作
 */
export type MenuAction =
  | {
      accordion?: boolean;
      parentPaths: string[];
      path: string;
      type: 'OPEN_MENU';
    }
  | { menus: string[]; type: 'SET_MENUS' }
  | { path: string; type: 'CLOSE_MENU' }
  | { type: 'RESET_MENUS' };

/**
 * 菜单状态的 reducer 函数，处理菜单的打开、关闭等状态更新
 * @param state - 当前打开的菜单路径数组
 * @param action - 要执行的菜单操作
 * @returns 更新后的菜单路径数组
 */
export function menuReducer(state: string[], action: MenuAction): string[] {
  switch (action.type) {
    case 'CLOSE_MENU': {
      if (!state.includes(action.path)) {
        return state;
      }
      return state.filter((path) => path !== action.path);
    }

    case 'OPEN_MENU': {
      if (state.includes(action.path)) {
        return state;
      }

      if (action.accordion) {
        const filteredMenus = state.filter((path) =>
          action.parentPaths.includes(path),
        );
        const newMenus = [...new Set([action.path, ...filteredMenus])];
        return newMenus.length === state.length &&
          newMenus.every((item, i) => item === state[i])
          ? state
          : newMenus;
      }

      return [...state, action.path];
    }

    case 'RESET_MENUS': {
      return state.length === 0 ? state : [];
    }

    case 'SET_MENUS': {
      return action.menus.length === state.length &&
        action.menus.every((item, i) => item === state[i])
        ? state
        : action.menus;
    }

    default: {
      return state;
    }
  }
}
