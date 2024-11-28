import { useRoute, useRouter } from '@xpress-core/router';

export default function Products() {
  const router = useRouter();
  const route = useRoute();

  // 从查询参数中获取分类和搜索关键词
  const category = route.query.category as string;
  const keyword = route.query.keyword as string;

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">产品列表</h1>
      <div className="mb-4">
        <p>当前分类: {category || '全部'}</p>
        <p>搜索关键词: {keyword || '无'}</p>
      </div>
      <div className="flex gap-4">
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white"
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
          className="rounded bg-gray-500 px-4 py-2 text-white"
          onClick={() =>
            router.push({
              path: '/products',
              query: { category: 'books' },
            })
          }
        >
          图书
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
