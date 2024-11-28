import { useRouter } from '@xpress-core/router';

export default function Admin() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push({ path: '/login' });
  };

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">管理页面</h1>
      <p className="mb-4">这是一个需要登录才能访问的页面</p>
      <div className="flex gap-4">
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white"
          onClick={() => router.push({ path: '/' })}
        >
          返回首页
        </button>
        <button
          className="rounded bg-red-500 px-4 py-2 text-white"
          onClick={handleLogout}
        >
          退出登录
        </button>
      </div>
    </div>
  );
}
