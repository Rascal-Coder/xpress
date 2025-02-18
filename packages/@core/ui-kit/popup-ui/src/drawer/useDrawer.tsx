import type { ComponentType } from 'react';

import type { Props } from './types';

import React, { useCallback, useMemo, useState } from 'react';

import { Drawer } from './Drawer';

type DrawerOptions = {
  connectedComponent?: ComponentType<any>;
} & Partial<Props>;

export type DrawerApi = {
  close: () => void;
  open: (options?: Partial<Props>) => void;
  update: (options: Partial<Props>) => void;
  useStore: <T>(selector: (state: Props) => T) => T;
};

interface DrawerComponentProps extends Partial<Props> {
  connectedProps?: Record<string, any>;
}

export function useDrawer(
  options: DrawerOptions = {},
): [ComponentType<DrawerComponentProps>, DrawerApi] {
  const [isOpen, setIsOpen] = useState(false);
  const [drawerProps, setDrawerProps] = useState<Props>({
    isOpen: false,
    setIsOpen,
    ...options,
  });

  const update = useCallback((newOptions: Partial<Props>) => {
    setDrawerProps((prev) => ({
      ...prev,
      ...newOptions,
    }));
  }, []);

  const open = useCallback(
    (openOptions?: Partial<Props>) => {
      setIsOpen(true);
      if (openOptions) {
        update(openOptions);
      }
    },
    [update],
  );

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const useStore = useCallback(
    <T,>(selector: (state: Props) => T): T => {
      return selector(drawerProps);
    },
    [drawerProps],
  );

  const api = useMemo(
    () => ({
      close,
      open,
      update,
      useStore,
    }),
    [open, close, update, useStore],
  );

  const DrawerComponent = React.memo(
    ({ connectedProps, ...props }: DrawerComponentProps) => {
      const mergedProps: Props = {
        ...drawerProps,
        ...props,
        isOpen,
        setIsOpen,
      };

      if (options.connectedComponent) {
        const ConnectedContent = options.connectedComponent;
        return (
          <Drawer {...mergedProps}>
            <ConnectedContent drawerApi={api} {...connectedProps} />
          </Drawer>
        );
      }

      return <Drawer {...mergedProps} />;
    },
  );

  DrawerComponent.displayName = 'DrawerComponent';

  const ConnectedDrawer = useMemo(() => DrawerComponent, [DrawerComponent]);

  return [ConnectedDrawer, api];
}
