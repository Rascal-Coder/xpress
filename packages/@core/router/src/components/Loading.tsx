import type { FC } from 'react';

/**
 * 加载组件的属性类型
 * @interface LoadingProps
 * @property {boolean} [spinning] - 是否显示加载状态
 * @public
 */
export interface LoadingProps {
  spinning?: boolean;
}

/**
 * 默认的加载组件
 * @param {LoadingProps} props
 * @public
 */
export const DefaultLoading: FC<LoadingProps> = ({ spinning }) => {
  if (!spinning) return null;

  return (
    <div
      style={{
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.65)',
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        left: 0,
        position: 'fixed',
        right: 0,
        top: 0,
        zIndex: 9999,
      }}
    >
      Loading...
    </div>
  );
};
