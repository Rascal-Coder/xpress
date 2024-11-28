import { unmountGlobalLoading } from '@xpress/utils';
import { useRouter } from '@xpress-core/router';

import { useEffect } from 'react';

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    unmountGlobalLoading();
  }, []);

  const handleLogin = () => {
    // 模拟登录
    localStorage.setItem('token', 'demo-token');

    // 获取重定向路径
    const urlParams = new URLSearchParams(window.location.search);
    const redirectPath = urlParams.get('redirect');

    if (redirectPath) {
      // 如果有重定向路径，跳转
      router.push({ path: decodeURIComponent(redirectPath) });
    } else {
      // 默认跳转到管理页面
      router.push({ path: '/admin' });
    }
  };

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">登录页面</h1>
      <div className="flex gap-4">
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white"
          onClick={handleLogin}
        >
          模拟登录
        </button>
        <button
          className="rounded bg-gray-500 px-4 py-2 text-white"
          onClick={() => router.push({ path: '/' })}
        >
          返回首页
        </button>
      </div>
    </div>
  );
}
