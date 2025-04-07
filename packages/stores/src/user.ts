import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface BasicUserInfo {
  [key: string]: any;
  /**
   * 头像
   */
  avatar: string;
  /**
   * 用户昵称
   */
  realName: string;
  /**
   * 用户角色
   */
  roles?: string[];
  /**
   * 用户id
   */
  userId: string;
  /**
   * 用户名
   */
  username: string;
}

interface AccessState {
  /**
   * 用户信息
   */
  userInfo: BasicUserInfo | null;
  /**
   * 用户角色
   */
  userRoles: string[];
}
interface UserStoreActions {
  reset: () => void;
  setUserInfo: (userInfo: BasicUserInfo | null) => void;
}
const initialState: AccessState = {
  userInfo: null,
  userRoles: [],
};
export const useUserStore = create<AccessState & UserStoreActions>()(
  devtools((set) => ({
    ...initialState,
    reset: () => set(initialState),
    setUserInfo: (userInfo: BasicUserInfo | null) => {
      // 设置用户信息
      set({ userInfo });
      // 设置角色信息
      const roles = userInfo?.roles ?? [];
      set({ userRoles: roles });
    },
  })),
);
