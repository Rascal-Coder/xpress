import { useSearchParams } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

const data: Product[] = [
  { id: 1, name: '商品1', price: 99, category: '电子' },
  { id: 2, name: '商品2', price: 199, category: '服装' },
  { id: 3, name: '商品3', price: 299, category: '食品' },
];

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get('sort') || 'default';

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchParams({ sort: e.target.value });
  };

  return (
    <div>
      <div className="mb-4 rounded-lg bg-white p-4 shadow">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">排序方式：</span>
          <select
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            onChange={handleSortChange}
            value={sort}
          >
            <option value="default">默认</option>
            <option value="price_asc">价格升序</option>
            <option value="price_desc">价格降序</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                商品名称
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                价格
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                分类
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data.map((product) => (
              <tr key={product.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {product.id}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {product.name}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  ¥{product.price}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {product.category}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
