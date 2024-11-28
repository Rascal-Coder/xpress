import { useRouter } from '@xpress-core/router';

export default function Home() {
  const router = useRouter();

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">路由功能测试</h1>
      <ul className="space-y-6">
        {/* 基础路由 */}
        <li>
          <h2 className="mb-2 text-lg font-bold">基础路由</h2>
          <div className="flex gap-2">
            <button
              className="rounded bg-blue-500 px-3 py-1 text-white"
              onClick={() => router.push({ path: '/about' })}
            >
              关于页面
            </button>
            <button
              className="rounded bg-green-500 px-3 py-1 text-white"
              onClick={() => router.push({ path: '/admin' })}
            >
              管理页面(需要登录)
            </button>
          </div>
        </li>

        {/* 查询参数 */}
        <li>
          <h2 className="mb-2 text-lg font-bold">查询参数测试</h2>
          <div className="flex gap-2">
            <button
              className="rounded bg-purple-500 px-3 py-1 text-white"
              onClick={() =>
                router.push({
                  path: '/products',
                  query: { category: 'electronics' },
                })
              }
            >
              电子产品
            </button>
            <button
              className="rounded bg-purple-500 px-3 py-1 text-white"
              onClick={() =>
                router.push({
                  path: '/products',
                  query: { category: 'books' },
                })
              }
            >
              图书分类
            </button>
            <button
              className="rounded bg-purple-500 px-3 py-1 text-white"
              onClick={() =>
                router.push({
                  path: '/products',
                  query: { category: 'new', keyword: 'hot' },
                })
              }
            >
              多参数(新品+热门)
            </button>
          </div>
        </li>

        {/* 动态路由 */}
        <li>
          <h2 className="mb-2 text-lg font-bold">动态路由测试</h2>
          <div className="flex gap-2">
            <button
              className="rounded bg-orange-500 px-3 py-1 text-white"
              onClick={() => router.push({ path: '/products/123' })}
            >
              商品 123
            </button>
            <button
              className="rounded bg-orange-500 px-3 py-1 text-white"
              onClick={() => router.push({ path: '/products/456' })}
            >
              商品 456
            </button>
            <button
              className="rounded bg-orange-500 px-3 py-1 text-white"
              onClick={() =>
                router.push({
                  path: '/products/789',
                  query: { source: 'home' },
                })
              }
            >
              商品 789 (带来源)
            </button>
          </div>
        </li>

        {/* 导航方法 */}
        <li>
          <h2 className="mb-2 text-lg font-bold">导航方法测试</h2>
          <div className="flex gap-2">
            <button
              className="rounded bg-orange-500 px-3 py-1 text-white"
              onClick={() =>
                router.replace({
                  path: '/products',
                  query: { mode: 'replace' },
                })
              }
            >
              替换当前页面
            </button>
            <button
              className="rounded bg-orange-500 px-3 py-1 text-white"
              onClick={() =>
                router.redirect({
                  path: '/login',
                  query: { from: 'home' },
                  replace: true,
                })
              }
            >
              重定向到登录
            </button>
          </div>
        </li>
      </ul>
    </div>
  );
}
