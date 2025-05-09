import { useLocation } from '@xpress/router';

import NProgress from 'nprogress';
import { useEffect, useRef } from 'react';

import { setNProgressColor } from './utils';

import 'nprogress/nprogress.css';

interface GetRandomNumberOptions {
  toFixed?: number;
}
NProgress.configure({ showSpinner: false });
export function getRandomNumber(
  max: number,
  min: number,
  options?: GetRandomNumberOptions,
) {
  const { toFixed = 0 } = options ?? {};
  return Number((Math.random() * (max - min) + min).toFixed(toFixed));
}
function act() {
  NProgress.start();
  NProgress.inc(getRandomNumber(0.2, 0.8));
  NProgress.done();
}

/**
 * 进度条
 */
export const Progress = () => {
  const { pathname } = useLocation();
  const mountedRef = useRef(false);

  // 主题色变化时更新NProgress颜色
  useEffect(() => {
    setNProgressColor('hsl(var(--primary))', { force: mountedRef.current });
  }, []);

  useEffect(() => {
    act();
    mountedRef.current = true;
  }, []);

  useEffect(() => {
    if (mountedRef.current) {
      act();
    }
  }, [pathname]);

  return null;
};
