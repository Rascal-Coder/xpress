/**
 * 提供一种稍微简单一些的写法用于创建Context
 */

import {
  createContext,
  type PropsWithChildren,
  type Context as ReactContext,
  useContext,
} from 'react';

interface CreateStoreParams<T extends Record<string, any>> {
  defaultValue?: T;
}

export function createStore<T extends Record<string, any>>(
  params?: CreateStoreParams<T>,
) {
  const { defaultValue } = params ?? {};
  const Context = createContext<T>(defaultValue ?? null!);

  function useStore() {
    return useContext(Context);
  }

  return {
    Context,
    useStore,
  };
}

interface CreateProviderParams<T> {
  Context: ReactContext<T>;
  useValue: () => T;
}

export function createProvider<T extends Record<string, any>>({
  Context,
  useValue,
}: CreateProviderParams<T>) {
  const Provider = ({ children }: PropsWithChildren) => {
    const value = useValue();
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };
  return Provider;
}
