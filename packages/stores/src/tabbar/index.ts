import type { Preferences } from '@xpress-core/preferences';
import type { TabDefinition } from '@xpress-core/router';

import { openRouteInNewWindow } from '@xpress-core/shared/utils';

import NProgress from 'nprogress';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface TabbarStoreActions {
  _bulkCloseByPaths: (paths: string[]) => Promise<void>;
  _close: (tab: TabDefinition) => void;
  _goToDefaultTab: (navigate: any) => Promise<void>;
  _goToTab: (tab: TabDefinition, navigate: any) => Promise<void>;
  addTab: (routeTab: TabDefinition, preferences: Preferences) => void;
  affixTabs: () => TabDefinition[];
  closeAllTabs: (navigate: any) => Promise<void>;
  closeTab: (tab: TabDefinition, currentTab: any, navigate: any) => void;
  getTabs: () => TabDefinition[];
  pinTab: (tab: TabDefinition) => void;
  refresh: () => Promise<void>;
  resetTabTitle: (tab: TabDefinition) => void;
  sortTabs: (oldIndex: number, newIndex: number) => void;
  toggleTabPin: (tab: TabDefinition) => void;
  unpinTab: (tab: TabDefinition) => void;
}
interface TabbarState {
  /**
   * @zh_CN 拖拽结束的索引
   */
  dragEndIndex: number;
  /**
   * @zh_CN 是否刷新
   */
  refreshing?: boolean;
  tabs: any[];
}
const initialState: TabbarState = {
  dragEndIndex: 0,
  refreshing: false,
  tabs: [],
};
type TabbarStore = TabbarState & TabbarStoreActions;
export const useTabbarStore = create<TabbarStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        /**
         * @zh_CN 批量关闭标签页
         * @param paths
         */
        async _bulkCloseByPaths(paths: string[]) {
          const { tabs } = get();
          set({
            tabs: tabs.filter((item) => {
              return !paths.includes(getTabPath(item));
            }),
          });
        },
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
        /**
         * @zh_CN 跳转到默认标签页
         * @param navigate
         */
        async _goToDefaultTab(navigate: any) {
          const { _goToTab, tabs } = get();
          if (tabs.length <= 0) {
            return;
          }
          const firstTab = tabs[0];
          if (firstTab) {
            await _goToTab(firstTab, navigate);
          }
        },
        /**
         * @zh_CN 跳转到标签页
         * @param tab
         * @param navigate
         */
        async _goToTab(tab: TabDefinition, navigate: any) {
          const { fullPath } = tab;
          await navigate(fullPath);
        },
        /**
         * @zh_CN 添加标签页
         * @param routeTab
         * @param preferences
         */
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
        /**
         * @zh_CN 获取固定标签页
         */
        affixTabs() {
          return get()
            .tabs.filter((tab) => isAffixTab(tab))
            .sort(
              (a, b) =>
                (a.meta?.affixTabOrder ?? 0) - (b.meta?.affixTabOrder ?? 0),
            );
        },
        /**
         * @zh_CN 关闭所有标签页
         */
        async closeAllTabs(navigate: any) {
          const { _goToDefaultTab, tabs } = get();
          const newTabs = tabs.filter((tab) => isAffixTab(tab));
          set({ tabs: newTabs.length > 0 ? newTabs : [...tabs].splice(0, 1) });
          await _goToDefaultTab(navigate);
        },
        /**
         * @zh_CN 关闭左侧标签页
         * @param tab
         */
        async closeLeftTabs(tab: TabDefinition) {
          const { _bulkCloseByPaths, tabs } = get();
          const index = tabs.findIndex(
            (item) => getTabPath(item) === getTabPath(tab),
          );

          if (index < 1) {
            return;
          }

          const leftTabs = tabs.slice(0, index);
          const paths: string[] = [];

          for (const item of leftTabs) {
            if (!isAffixTab(item)) {
              paths.push(getTabPath(item));
            }
          }
          await _bulkCloseByPaths(paths);
        },
        /**
         * @zh_CN 关闭其他标签页
         * @param tab
         */
        async closeOtherTabs(tab: TabDefinition) {
          const { _bulkCloseByPaths, tabs } = get();
          const closePaths = tabs.map((item) => getTabPath(item));

          const paths: string[] = [];

          for (const path of closePaths) {
            if (path !== tab.fullPath) {
              const closeTab = tabs.find((item) => getTabPath(item) === path);
              if (!closeTab) {
                continue;
              }
              if (!isAffixTab(closeTab)) {
                paths.push(getTabPath(closeTab));
              }
            }
          }
          await _bulkCloseByPaths(paths);
        },
        /**
         * @zh_CN 关闭右侧标签页
         * @param tab
         */
        async closeRightTabs(tab: TabDefinition) {
          const { _bulkCloseByPaths, tabs } = get();
          const index = tabs.findIndex(
            (item) => getTabPath(item) === getTabPath(tab),
          );

          if (index !== -1 && index < tabs.length - 1) {
            const rightTabs = tabs.slice(index + 1);

            const paths: string[] = [];
            for (const item of rightTabs) {
              if (!isAffixTab(item)) {
                paths.push(getTabPath(item));
              }
            }
            await _bulkCloseByPaths(paths);
          }
        },
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
        /**
         * 根据路径获取标签页
         * @param path
         */
        getTabByPath(path: string) {
          const { tabs } = get();
          return tabs.find(
            (item) => getTabPath(item) === path,
          ) as TabDefinition;
        },
        getTabs() {
          const { affixTabs, tabs } = get();
          const _affixTabs = affixTabs();
          return [..._affixTabs, ...tabs.filter((tab) => !isAffixTab(tab))];
        },

        /**
         * @zh_CN 新窗口打开标签页
         * @param tab
         */
        async openTabInNewWindow(tab: TabDefinition) {
          openRouteInNewWindow(tab.fullPath || tab.path);
        },
        /**
         * @zh_CN 固定标签页
         * @param tab
         */
        async pinTab(tab: TabDefinition) {
          const { sortTabs, tabs } = get();
          const index = tabs.findIndex(
            (item) => getTabPath(item) === getTabPath(tab),
          );
          if (index !== -1) {
            const oldTab = tabs[index];
            tab.meta.affixTab = true;
            tab.meta.title = oldTab?.meta?.title as string;
            // this.addTab(tab);
            tabs.splice(index, 1, tab);
            set({ tabs: [...tabs] });
          }
          // 过滤固定tabs
          const affixTabs = tabs.filter((tab) => isAffixTab(tab));
          // 获得固定tabs的index
          const newIndex = affixTabs.findIndex(
            (item) => getTabPath(item) === getTabPath(tab),
          );
          // 交换位置重新排序
          sortTabs(index, newIndex);
        },
        /**
         * 刷新标签页
         */
        async refresh() {
          const { refreshing } = get();
          if (refreshing) {
            return;
          }
          set({ refreshing: true });
          NProgress.start();
          NProgress.inc(getRandomNumber(0.2, 0.8));
          await new Promise((resolve) => setTimeout(resolve, 200));
          NProgress.done();
          set({ refreshing: false });
        },
        /**
         * @zh_CN 重置标签页标题
         */
        async resetTabTitle(tab: TabDefinition) {
          const { tabs } = get();
          if (tab?.meta?.newTabTitle) {
            return;
          }
          const findTab = tabs.find(
            (item) => getTabPath(item) === getTabPath(tab),
          );
          if (findTab) {
            findTab.meta.newTabTitle = undefined;
            set({ tabs: [...tabs] });
          }
        },
        /**
         * @zh_CN 设置标签页顺序
         * @param oldIndex
         * @param newIndex
         */
        sortTabs(oldIndex: number, newIndex: number) {
          const { dragEndIndex, tabs } = get();
          const currentTab = tabs[oldIndex];
          if (!currentTab) {
            return;
          }
          tabs.splice(oldIndex, 1);
          tabs.splice(newIndex, 0, currentTab);
          set({ tabs: [...tabs] });
          set({ dragEndIndex: dragEndIndex + 1 });
        },
        /**
         * @zh_CN 切换固定标签页
         * @param tab
         */
        async toggleTabPin(tab: TabDefinition) {
          const { pinTab, unpinTab } = get();
          const affixTab = tab?.meta?.affixTab ?? false;

          affixTab ? unpinTab(tab) : pinTab(tab);
        },
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
  const refreshing = useTabbarStore((state) => state.refreshing);
  const refresh = useTabbarStore((state) => state.refresh);
  return {
    addTab,
    closeTab,
    refresh,
    refreshing,
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
interface GetRandomNumberOptions {
  toFixed?: number;
}
function getRandomNumber(
  max: number,
  min: number,
  options?: GetRandomNumberOptions,
) {
  const { toFixed = 0 } = options ?? {};
  return Number((Math.random() * (max - min) + min).toFixed(toFixed));
}
