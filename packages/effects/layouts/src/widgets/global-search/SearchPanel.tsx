import { X } from '@xpress-core/icons';
import { type RouteConfig, useNavigate } from '@xpress-core/router';
import {
  ScrollArea,
  XpressIcon,
  XpressIconButton,
} from '@xpress-core/shadcn-ui';

import { useEffect, useState } from 'react';

const SEARCH_HISTORY_KEY = 'search_history';
const MAX_HISTORY_ITEMS = 10;

interface SimplifiedRoute {
  pathname: string;
  meta?: RouteConfig['meta'];
}

interface SearchPanelProps {
  routes: RouteConfig[];
  setIsOpen: (isOpen: boolean) => void;
  searchQuery: string;
}

export const SearchPanel = ({
  routes,
  setIsOpen,
  searchQuery,
}: SearchPanelProps) => {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchHistory, setSearchHistory] = useState<SimplifiedRoute[]>([]);

  // 初始化搜索历史
  useEffect(() => {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  // 保存搜索历史
  const saveToHistory = (route: RouteConfig) => {
    if (!route.pathname) return;

    const simplifiedRoute = {
      pathname: route.pathname,
      meta: route.meta,
    };

    const newHistory = [
      simplifiedRoute,
      ...searchHistory.filter((item) => item.pathname !== route.pathname),
    ].slice(0, MAX_HISTORY_ITEMS);

    setSearchHistory(newHistory);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  };

  const handleSelectRoute = (route: RouteConfig | SimplifiedRoute) => {
    if (route.pathname) {
      if ('path' in route) {
        saveToHistory(route as RouteConfig);
      }
      navigate(route.pathname);
      setIsOpen(false);
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  };

  const removeHistoryItem = (pathname: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newHistory = searchHistory.filter(
      (item) => item.pathname !== pathname,
    );
    setSearchHistory(newHistory);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const items = searchQuery ? routes : searchHistory;
      if (items.length === 0) return;

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % items.length);
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
          break;
        }
        case 'Enter': {
          e.preventDefault();
          const selectedItem = items[selectedIndex];
          if (selectedItem) {
            handleSelectRoute(selectedItem);
          }
          break;
        }
        case 'Escape': {
          e.preventDefault();
          setIsOpen(false);
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routes.length, searchHistory.length, selectedIndex, searchQuery]);

  // Reset selected index when search query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // 默认状态显示搜索历史
  if (!searchQuery) {
    return (
      <div className="flex h-[300px] flex-col p-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-muted-foreground text-sm">最近搜索</span>
          {searchHistory.length > 0 && (
            <button
              className="text-muted-foreground hover:text-primary text-sm"
              onClick={clearHistory}
            >
              清除历史
            </button>
          )}
        </div>
        {searchHistory.length > 0 ? (
          <ScrollArea className="flex-1">
            <div className="space-y-2">
              {searchHistory.map((route, index) => (
                <div
                  className={`bg-accent hover:bg-primary hover:text-primary-foreground flex cursor-pointer items-center justify-between rounded-md p-2 ${
                    index === selectedIndex
                      ? 'bg-primary text-primary-foreground'
                      : ''
                  }`}
                  key={route.pathname}
                  onClick={() => handleSelectRoute(route)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex items-center gap-2 p-2">
                    <XpressIcon fallback icon={route.meta?.icon}></XpressIcon>
                    <span>{route.meta?.title}</span>
                  </div>
                  {/* <button
                    className="hover:bg-accent"
                    onClick={(e: React.MouseEvent) =>
                      removeHistoryItem(route.pathname, e)
                    }
                  >
                    <X className="h-4 w-4" />
                  </button> */}
                  <XpressIconButton
                    className="hover:bg-accent h-6 w-6 hover:opacity-100"
                    onClick={(e: React.MouseEvent) =>
                      removeHistoryItem(route.pathname, e)
                    }
                  >
                    <X className="h-4 w-4" />
                  </XpressIconButton>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="mb-4 text-5xl">😊</div>
            <div className="text-muted-foreground text-center">
              输入你要搜索的导航
            </div>
          </div>
        )}
      </div>
    );
  }

  // 有搜索内容但没有结果
  if (searchQuery && routes.length === 0) {
    return (
      <div className="flex h-[300px] flex-col items-center justify-center p-2">
        <div className="mb-4 text-5xl">😔</div>
        <div className="text-muted-foreground text-center">
          没有找到你想要的
        </div>
      </div>
    );
  }

  // 有搜索结果时显示结果列表
  return (
    <div className="p-2">
      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {routes.map((route, index) => (
            <div
              className={`bg-accent flex cursor-pointer items-center justify-between rounded-md p-2 ${
                index === selectedIndex
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-primary hover:text-primary-foreground'
              }`}
              key={route.pathname}
              onClick={() => handleSelectRoute(route)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="flex items-center gap-2 p-2">
                <XpressIcon fallback icon={route.meta?.icon}></XpressIcon>
                <span>{route.meta?.title}</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
