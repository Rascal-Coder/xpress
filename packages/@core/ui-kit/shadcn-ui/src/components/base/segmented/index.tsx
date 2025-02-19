import type { CSSProperties } from 'react';

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { TabsIndicator } from './TabsIndicator';

export interface SegmentedItem {
  label: string;
  value: string;
}

interface SegmentedContextType {
  activeTabRef: HTMLElement | null;
  orientation?: 'horizontal' | 'vertical';
  registerTab: (value: string, element: HTMLElement | null) => void;
}

const SegmentedContext = createContext<SegmentedContextType>({
  activeTabRef: null,
  orientation: 'horizontal',
  registerTab: () => {},
});

export const useSegmentedContext = () => useContext(SegmentedContext);

interface SegmentedProps {
  children?: React.ReactNode;
  defaultValue?: string;
  onChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  tabs: SegmentedItem[];
  value?: string;
}

export const Segmented = ({
  defaultValue = '',
  onChange,
  orientation = 'horizontal',
  tabs = [],
  value,
  children,
}: SegmentedProps) => {
  const [activeTab, setActiveTab] = useState(
    value || defaultValue || tabs[0]?.value,
  );
  const [activeTabRef, setActiveTabRef] = useState<HTMLElement | null>(null);
  const tabRefs = useRef(new Map<string, HTMLElement>());

  const registerTab = useCallback(
    (tabValue: string, element: HTMLElement | null) => {
      if (element) {
        tabRefs.current.set(tabValue, element);
        if (tabValue === activeTab) {
          setActiveTabRef(element);
        }
      } else {
        tabRefs.current.delete(tabValue);
        if (tabValue === activeTab) {
          setActiveTabRef(null);
        }
      }
    },
    [activeTab],
  );

  const handleValueChange = (newValue: string) => {
    setActiveTab(newValue);
    setActiveTabRef(tabRefs.current.get(newValue) || null);
    onChange?.(newValue);
  };

  const tabsStyle: CSSProperties = {
    gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))`,
  };

  return (
    <SegmentedContext.Provider
      value={{
        activeTabRef,
        orientation,
        registerTab,
      }}
    >
      <Tabs onValueChange={handleValueChange} value={activeTab}>
        <TabsList className="bg-accent relative grid w-full" style={tabsStyle}>
          <TabsIndicator />
          {tabs.map((tab) => (
            <TabsTrigger
              className="z-20 inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium disabled:pointer-events-none disabled:opacity-50"
              key={tab.value}
              ref={(element) => registerTab(tab.value, element)}
              value={tab.value}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {children}
          </TabsContent>
        ))}
      </Tabs>
    </SegmentedContext.Provider>
  );
};
