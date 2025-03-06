import type { RouteConfig } from '@xpress-core/router';
import type { MenuRecordRaw } from '@xpress-core/typings';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type AccessToken = null | string;
interface AccessStoreActions {
  setAccessCodes: (codes: string[]) => void;
  setAccessMenus: (menus: MenuRecordRaw[]) => void;
  setAccessRoutes: (routes: RouteConfig[]) => void;
  setAccessToken: (token: AccessToken) => void;
  setIsAccessChecked: (isAccessChecked: boolean) => void;
  setLoginExpired: (loginExpired: boolean) => void;
  setRefreshToken: (token: AccessToken) => void;
}
interface AccessState {
  /**
   * 权限码
   */
  accessCodes: string[];
  /**
   * 可访问的菜单列表
   */
  accessMenus: MenuRecordRaw[];
  /**
   * 可访问的路由列表
   */
  accessRoutes: RouteConfig[];
  /**
   * 登录 accessToken
   */
  accessToken: AccessToken;
  /**
   * 是否已经检查过权限
   */
  isAccessChecked: boolean;
  /**
   * 登录是否过期
   */
  loginExpired: boolean;
  /**
   * 登录 accessToken
   */
  refreshToken: AccessToken;
}
const initialState: AccessState = {
  accessCodes: [],
  accessMenus: [],
  accessRoutes: [],
  accessToken: null,
  isAccessChecked: false,
  loginExpired: false,
  refreshToken: null,
};
type AccessStore = AccessState & AccessStoreActions;
export const useAccessStore = create<AccessStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        setAccessCodes: (codes: string[]) => set({ accessCodes: codes }),
        setAccessMenus: (menus: MenuRecordRaw[]) => set({ accessMenus: menus }),
        setAccessRoutes: (routes: RouteConfig[]) =>
          set({ accessRoutes: routes }),
        setAccessToken: (token: AccessToken) => set({ accessToken: token }),
        setIsAccessChecked: (isAccessChecked: boolean) =>
          set({ isAccessChecked }),
        setLoginExpired: (loginExpired: boolean) => set({ loginExpired }),
        setRefreshToken: (token: AccessToken) => set({ refreshToken: token }),
      }),
      {
        name: 'xpress-access',
        partialize: (state) => ({
          accessCodes: state.accessCodes,
          accessToken: state.accessToken,
          isAccessChecked: state.isAccessChecked,
          refreshToken: state.refreshToken,
        }),
      },
    ),
  ),
);
