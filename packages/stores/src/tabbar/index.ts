import type { Preferences } from '@xpress-core/preferences';
import type { TabDefinition } from '@xpress-core/router';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface TabbarStoreActions {
  addTab: (routeTab: TabDefinition, preferences: Preferences) => void;
}
interface TabbarState {
  tabs: any[];
}
const initialState: TabbarState = {
  tabs: [],
};
type TabbarStore = TabbarState & TabbarStoreActions;
export const useTabbarStore = create<TabbarStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        addTab: (routeTab: TabDefinition, preferences: Preferences) => {
          if (!isTabShown(routeTab)) {
            return;
          }
          const _tabs = get().tabs;
          const tabIndex = _tabs.findIndex(
            (tab) => getTabPath(tab) === getTabPath(routeTab),
          );
          // eslint-disable-next-line unicorn/no-negated-condition
          if (tabIndex !== -1) {
            const maxCount = preferences.tabbar.maxCount;
            // 获取动态路由打开数，超过 0 即代表需要控制打开数
            const maxNumOfOpenTab = (routeTab?.meta?.maxNumOfOpenTab ??
              -1) as number;
            // 如果动态路由层级大于 0 了，那么就要限制该路由的打开数限制了
            // 获取到已经打开的动态路由数, 判断是否大于某一个值
            if (
              maxNumOfOpenTab > 0 &&
              _tabs.filter((tab) => tab.path === routeTab.path).length >=
                maxNumOfOpenTab
            ) {
              // 关闭第一个
              const index = _tabs.findIndex(
                (item) => item.path === routeTab.path,
              );
              index !== -1 && _tabs.splice(index, 1);
            } else if (maxCount > 0 && _tabs.length >= maxCount) {
              // 关闭第一个
              const index = _tabs.findIndex(
                (item) =>
                  !Reflect.has(item.meta, 'affixTab') || !item.meta.affixTab,
              );
              index !== -1 && _tabs.splice(index, 1);
            }
            const res = {
              ...routeTab.meta,
              key: routeTab.path,
            };
            const tabs = [];
            tabs.push(res);
            return set({ tabs });
          } else {
            const currentTab = _tabs[tabIndex];
            const mergedTab = {
              ...currentTab,
              ...routeTab,
              meta: { ...currentTab?.meta, ...routeTab.meta },
            };
            if (currentTab) {
              const curMeta = currentTab.meta;
              if (Reflect.has(curMeta, 'affixTab')) {
                mergedTab.meta.affixTab = curMeta.affixTab;
              }
              if (Reflect.has(curMeta, 'newTabTitle')) {
                mergedTab.meta.newTabTitle = curMeta.newTabTitle;
              }
            }
            _tabs.splice(tabIndex, 1, mergedTab);
            return set({ tabs: _tabs });
          }
        },
      }),
      {
        name: 'xpress-tabbar',
        partialize: (state) => ({
          tabs: state.tabs,
        }),
      },
    ),
  ),
);

export const useTabbar = () => {
  const addTab = useTabbarStore((state) => state.addTab);
  const tabs = useTabbarStore((state) => state.tabs);
  return {
    addTab,
    tabs,
  };
};

function isTabShown(tab: TabDefinition) {
  return !tab.meta.hideInTab;
}

function getTabPath(tab: TabDefinition) {
  return decodeURIComponent(tab.fullPath || tab.path);
}
