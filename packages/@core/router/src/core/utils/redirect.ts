import type { RedirectOptions, RouterOptions } from '../types';

const DEFAULT_REDIRECT_QUERY_KEY = 'redirect';

/**
 * 创建重定向函数
 */
export function createRedirect() {
  return function redirect(to: RedirectOptions) {
    const { path, query = {}, replace = false } = to;
    const urlParams = new URLSearchParams();

    // 添加自定义查询参数
    Object.entries(query).forEach(([key, value]) => {
      if (value) {
        urlParams.set(key, value);
      }
    });

    const url = urlParams.toString() ? `${path}?${urlParams.toString()}` : path;

    if (replace) {
      window.location.replace(url);
    } else {
      window.location.href = url;
    }
  };
}

/**
 * 获取重定向路径
 * @param options 路由配置
 */
export function getRedirectPath(options: RouterOptions) {
  const queryKey = options.redirect?.queryKey || DEFAULT_REDIRECT_QUERY_KEY;
  const urlParams = new URLSearchParams(window.location.search);
  const redirectPath = urlParams.get(queryKey);

  return redirectPath ? decodeURIComponent(redirectPath) : undefined;
}
