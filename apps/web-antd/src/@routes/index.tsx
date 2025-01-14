import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">仪表盘</h1>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-sm font-medium text-gray-500">用户总数</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">1,128</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-sm font-medium text-gray-500">商品总数</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">93</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-sm font-medium text-gray-500">订单总数</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">221</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-sm font-medium text-gray-500">评论总数</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">668</p>
        </div>
      </div>

      {/* 功能卡片 */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-medium text-gray-900">快速入口</h2>
          <div className="mt-4 space-y-3">
            <div>
              <Link
                className="text-blue-600 hover:text-blue-800 hover:underline"
                to="/users"
              >
                用户管理
              </Link>
            </div>
            <div>
              <Link
                className="text-blue-600 hover:text-blue-800 hover:underline"
                to="/products"
              >
                商品管理
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-medium text-gray-900">系统信息</h2>
          <div className="mt-4 space-y-3">
            <div className="text-sm text-gray-600">版本：1.0.0</div>
            <div className="text-sm text-gray-600">更新时间：2024-01-14</div>
          </div>
        </div>
      </div>
    </div>
  );
}
