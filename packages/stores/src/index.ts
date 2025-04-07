import { useAccessStore } from './access';
import { useUserStore } from './user';

export * from './access';
export * from './tabbar';
export * from './user';

export const resetAllStores = () => {
  useAccessStore.getState().reset();
  useUserStore.getState().reset();
};
