export default function DashboardPage() {
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-sm font-medium text-gray-500">今日访问量</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">2,847</p>
          <p className="mt-2 text-sm text-green-600">↑ 12% 较昨日</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-sm font-medium text-gray-500">活跃用户</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">1,257</p>
          <p className="mt-2 text-sm text-green-600">↑ 8% 较昨日</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-sm font-medium text-gray-500">转化率</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">3.24%</p>
          <p className="mt-2 text-sm text-red-600">↓ 2% 较昨日</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium text-gray-900">最近活动</h3>
          <div className="mt-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div className="flex items-start space-x-4" key={i}>
                <div className="h-10 w-10 rounded-full bg-gray-200" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    用户操作 {i}
                  </p>
                  <p className="text-sm text-gray-500">2分钟前</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium text-gray-900">系统状态</h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">CPU 使用率</span>
              <span className="text-sm font-medium text-gray-900">28%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">内存使用率</span>
              <span className="text-sm font-medium text-gray-900">42%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">磁盘使用率</span>
              <span className="text-sm font-medium text-gray-900">65%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
