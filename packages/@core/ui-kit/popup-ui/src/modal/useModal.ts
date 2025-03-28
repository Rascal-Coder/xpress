// useModal.js - 创建Modal实例的hook
import React, { useMemo, useRef, useState } from 'react';

import Modal from './Modal';

// 定义Modal状态和选项类型
interface ModalState {
  [key: string]: any;
  bordered?: boolean;
  centered?: boolean;
  closeOnClickModal?: boolean;
  closeOnPressEscape?: boolean;
  confirmLoading?: boolean;
  draggable?: boolean;
  footer?: boolean | React.ReactNode;
  fullscreen?: boolean;
  isOpen: boolean;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  submitting?: boolean;
  title?: React.ReactNode;
}

interface ModalOptions extends Partial<ModalState> {
  connectedComponent?: React.ComponentType<any>;
  onBeforeClose?: () => boolean | Promise<boolean>;
  onCancel?: () => void;
  onClosed?: () => void;
  onConfirm?: () => void;
  onOpenChange?: (isOpen: boolean) => void;
  onOpened?: () => void;
}
// 创建Modal状态管理Store
class ModalStore {
  listeners: Set<(state: ModalState) => void>;
  state: ModalState;

  constructor(initialState: Partial<ModalState> = {}) {
    this.state = {
      bordered: true,
      centered: false,
      closeOnClickModal: true,
      closeOnPressEscape: true,
      confirmLoading: false,
      draggable: false,
      footer: true,
      fullscreen: false,
      isOpen: false,
      showCancelButton: true,
      showConfirmButton: true,
      title: '',
      ...initialState,
    };
    this.listeners = new Set();
  }

  getState(): ModalState {
    return this.state;
  }

  notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  setState(
    updater: ((state: ModalState) => Partial<ModalState>) | Partial<ModalState>,
  ) {
    const newState =
      typeof updater === 'function' ? updater(this.state) : updater;

    this.state = { ...this.state, ...newState };
    this.notify();
  }

  subscribe(listener: (state: ModalState) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}
interface ModalApi {
  close: () => Promise<ModalApi>;
  getData: <T>() => T;
  getState: () => ModalState;
  lock: (isLocked?: boolean) => ModalApi;
  onCancel: () => void;
  onConfirm: () => void;
  open: () => ModalApi;
  setData: <T>(data: T) => ModalApi;
  setState: (
    updater: ((state: ModalState) => Partial<ModalState>) | Partial<ModalState>,
  ) => ModalApi;
  sharedData: any;
  store: ModalStore;
  subscribe: (listener: (state: ModalState) => void) => () => void;
  unlock: () => ModalApi;
}

// 用于创建Modal API的工厂函数
export const createModalApi = (options: ModalOptions = {}): ModalApi => {
  const store = new ModalStore(options);
  const {
    onBeforeClose,
    onCancel,
    onClosed,
    onConfirm,
    onOpenChange,
    onOpened,
  } = options;

  const api: ModalApi = {
    async close() {
      const allowClose = await (onBeforeClose?.() ?? true);
      if (allowClose) {
        store.setState({ isOpen: false });
        onClosed?.();
        onOpenChange?.(false);
      }
      return api;
    },

    getData<T>(): T {
      return this.sharedData as T;
    },

    getState() {
      return store.getState();
    },

    lock(isLocked = true) {
      return api.setState({ submitting: isLocked });
    },

    onCancel() {
      if (onCancel) {
        onCancel();
      } else {
        api.close();
      }
    },

    onConfirm() {
      onConfirm?.();
    },

    open() {
      store.setState({ isOpen: true });
      onOpened?.();
      onOpenChange?.(true);
      return api;
    },

    setData<T>(data: T) {
      this.sharedData = data;
      return api;
    },

    setState(updater) {
      store.setState(updater);
      return api;
    },

    sharedData: {},

    store,

    subscribe(listener) {
      return store.subscribe(listener);
    },
    unlock() {
      return api.lock(false);
    },
  };

  return api;
};

// useModal Hook - 类似Vue中的useVbenModal
export const useModal = (
  options: ModalOptions = {},
): [React.ComponentType<any>, ModalApi] => {
  const { connectedComponent, ...restOptions } = options;
  const modalApi = useMemo(() => createModalApi(restOptions), []);
  const [state, setState] = useState<ModalState>(modalApi.getState());

  // 订阅状态变化
  useMemo(() => {
    return modalApi.subscribe(setState);
  }, [modalApi]);

  // 创建Modal组件
  const CustomModal: React.ComponentType<any> = useMemo(() => {
    // 创建连接的组件
    const ConnectedComponentFn = (props: any, ref: any) => {
      const modalRef = useRef(null);

      // 暴露API给ref
      React.useImperativeHandle(ref, () => ({
        api: modalApi,
        close: modalApi.close,
        open: modalApi.open,
      }));

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return React.createElement(connectedComponent!, {
        ...props,
        modalApi,
        ref: modalRef,
        state,
      });
    };
    ConnectedComponentFn.displayName = 'ConnectedModalComponent';

    const ConnectedComponent = connectedComponent
      ? React.forwardRef(ConnectedComponentFn)
      : null;

    // 创建默认组件
    const DefaultComponent = React.forwardRef((props: any, ref) => {
      const modalRef = useRef(null);

      // 暴露API给ref
      React.useImperativeHandle(ref, () => ({
        api: modalApi,
        close: modalApi.close,
        open: modalApi.open,
      }));

      return React.createElement(
        Modal,
        {
          ref: modalRef,
          ...state,
          ...props,
          onCancel: modalApi.onCancel,
          onClose: modalApi.close,
          onConfirm: modalApi.onConfirm,
        },
        props.children,
      );
    });

    DefaultComponent.displayName = 'DefaultModalComponent';

    return connectedComponent
      ? (ConnectedComponent as React.ComponentType<any>)
      : DefaultComponent;
  }, [connectedComponent, modalApi, state]);

  return [CustomModal, modalApi] as [React.ComponentType<any>, ModalApi];
};

export default useModal;
