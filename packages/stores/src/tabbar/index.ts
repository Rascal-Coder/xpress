import type { Preferences } from '@xpress-core/preferences';
import type { TabDefinition } from '@xpress-core/router';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface TabbarStoreActions {
  _close: (tab: TabDefinition) => void;
  _goToTab: (tab: TabDefinition, navigate: any) => Promise<void>;
  addTab: (routeTab: TabDefinition, preferences: Preferences) => void;
  affixTabs: () => TabDefinition[];
  closeTab: (tab: TabDefinition, currentTab: any, navigate: any) => void;
  getTabs: () => TabDefinition[];
  sortTabs: (oldIndex: number, newIndex: number) => void;
  unpinTab: (tab: TabDefinition) => void;
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
        _close(tab: TabDefinition) {
          const { fullPath } = tab;
          if (isAffixTab(tab)) {
            return;
          }
          const _tabs = get().tabs;
          const index = _tabs.findIndex((item) => item.fullPath === fullPath);
          index !== -1 && _tabs.splice(index, 1);
          return set({ tabs: [..._tabs] });
        },
        async _goToTab(tab: TabDefinition, navigate: any) {
          const { fullPath } = tab;
          await navigate(fullPath);
        },
        addTab: (routeTab: TabDefinition, preferences: Preferences) => {
          if (!isTabShown(routeTab)) {
            return;
          }
          const _tabs = get().tabs;
          const tabIndex = _tabs.findIndex(
            (tab) => getTabPath(tab) === getTabPath(routeTab),
          );
          if (tabIndex === -1) {
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
            const newTab = {
              ...routeTab,
            };
            return set({ tabs: [..._tabs, newTab] });
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
            return set({ tabs: [..._tabs] });
          }
        },
        affixTabs() {
          return get()
            .tabs.filter((tab) => isAffixTab(tab))
            .sort(
              (a, b) =>
                (a.meta?.affixTabOrder ?? 0) - (b.meta?.affixTabOrder ?? 0),
            );
        },
        // async closeAllTabs(router: Router) {
        //   const newTabs = this.tabs.filter((tab) => isAffixTab(tab));
        //   this.tabs =
        //     newTabs.length > 0 ? newTabs : [...this.tabs].splice(0, 1);
        //   await this._goToDefaultTab(router);
        // },
        /**
         * @zh_CN 关闭标签页
         * @param tab
         * @param router
         */
        async closeTab(tab: TabDefinition, currentTab: any, navigate: any) {
          const { _close, _goToTab, getTabs } = get();
          // 关闭不是激活选项卡
          if (getTabPath(currentTab) !== getTabPath(tab)) {
            _close(tab);
            return;
          }
          const index = getTabs().findIndex(
            (item) => getTabPath(item) === getTabPath(currentTab),
          );
          const before = getTabs()[index - 1];
          const after = getTabs()[index + 1];

          // 下一个tab存在，跳转到下一个
          if (after) {
            _close(tab);
            await _goToTab(after, navigate);
            // 上一个tab存在，跳转到上一个
          } else if (before) {
            _close(tab);
            await _goToTab(before, navigate);
          } else {
            console.error(
              'Failed to close the tab; only one tab remains open.',
            );
          }
        },
        getTabs() {
          const { affixTabs, tabs } = get();
          const _affixTabs = affixTabs();
          return [..._affixTabs, ...tabs.filter((tab) => !isAffixTab(tab))];
        },
        /**
         * @zh_CN 设置标签页顺序
         * @param oldIndex
         * @param newIndex
         */
        sortTabs(oldIndex: number, newIndex: number) {
          const { tabs } = get();
          const currentTab = tabs[oldIndex];
          if (!currentTab) {
            return;
          }
          tabs.splice(oldIndex, 1);
          tabs.splice(newIndex, 0, currentTab);
          // this.dragEndIndex = this.dragEndIndex + 1;
        },
        //   await (affixTab ? unpinTab(tab) : pinTab(tab));
        // },
        /**
         * @zh_CN 取消固定标签页
         * @param tab
         */
        unpinTab(tab: TabDefinition) {
          const _tabs = get().tabs;
          const sortTabs = get().sortTabs;
          const index = _tabs.findIndex(
            (item) => getTabPath(item) === getTabPath(tab),
          );

          if (index === -1) {
            console.warn('Tab not found when trying to unpin');
            return;
          }

          const oldTab = _tabs[index];
          tab.meta.affixTab = false;
          tab.meta.title = oldTab?.meta?.title as string;

          // 先进行排序
          const affixTabs = _tabs.filter((tab) => isAffixTab(tab));
          const newIndex = affixTabs.length;
          sortTabs(index, newIndex);

          // 最后更新状态
          _tabs.splice(index, 1, tab);
          set({ tabs: [..._tabs] });
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
  const closeTab = useTabbarStore((state) => state.closeTab);
  const sortTabs = useTabbarStore((state) => state.sortTabs);
  const unpinTab = useTabbarStore((state) => state.unpinTab);
  return {
    addTab,
    closeTab,
    sortTabs,
    tabs,
    unpinTab,
  };
};

function isTabShown(tab: TabDefinition) {
  return !tab.meta.hideInTab;
}

function getTabPath(tab: TabDefinition) {
  return decodeURIComponent(tab.fullPath || tab.path);
}

/**
 * @zh_CN 是否是固定标签页
 * @param tab
 */
function isAffixTab(tab: TabDefinition) {
  return tab?.meta?.affixTab ?? false;
}
