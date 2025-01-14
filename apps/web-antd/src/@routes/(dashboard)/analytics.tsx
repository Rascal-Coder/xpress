export default function AnalyticsPage() {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">数据分析</h2>

      {/* 图表卡片 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-medium text-gray-900">访问趋势</h3>
          <div className="h-64 rounded bg-gray-50 p-4">
            {/* 这里可以放置实际的图表组件 */}
            <div className="flex h-full items-center justify-center text-gray-400">
              访问量趋势图
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-medium text-gray-900">用户分布</h3>
          <div className="h-64 rounded bg-gray-50 p-4">
            {/* 这里可以放置实际的图表组件 */}
            <div className="flex h-full items-center justify-center text-gray-400">
              用户地域分布图
            </div>
          </div>
        </div>
      </div>

      {/* 数据表格 */}
      <div className="mt-6 rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-medium text-gray-900">流量来源</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  来源
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  访问量
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  占比
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  转化率
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <tr>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  直接访问
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  1,234
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  45%
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  5.2%
                </td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  搜索引擎
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  956
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  35%
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  4.8%
                </td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  社交媒体
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  547
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  20%
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  3.9%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
