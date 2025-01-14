import { Link, Outlet } from 'react-router-dom';

export default function SharedLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <nav className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <Link className="text-xl font-bold text-gray-900" to="/">
                  我的应用
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  className="inline-flex items-center border-b-2 border-blue-500 px-1 pt-1 text-sm font-medium text-gray-900"
                  to="/"
                >
                  首页
                </Link>
                <Link
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  to="/products"
                >
                  产品
                </Link>
                <Link
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  to="/about"
                >
                  关于
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Link
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                to="/login"
              >
                登录
              </Link>
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                type="button"
              >
                <span className="sr-only">打开主菜单</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M4 6h16M4 12h16M4 18h16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* 移动端菜单 */}
        <div className="hidden sm:hidden">
          <div className="space-y-1 pb-3 pt-2">
            <Link
              className="block border-l-4 border-blue-500 bg-blue-50 py-2 pl-3 pr-4 text-base font-medium text-blue-700"
              to="/"
            >
              首页
            </Link>
            <Link
              className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
              to="/products"
            >
              产品
            </Link>
            <Link
              className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
              to="/about"
            >
              关于
            </Link>
          </div>
          <div className="border-t border-gray-200 pb-3 pt-4">
            <div className="space-y-1">
              <Link
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                to="/login"
              >
                登录
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 页面内容 */}
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="border-t border-gray-200 pt-8">
            <div className="text-center">
              <p className="text-sm text-gray-500">
                &copy; 2024 我的应用. 保留所有权利.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
