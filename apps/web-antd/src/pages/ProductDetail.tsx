import { useRoute, useRouter } from '@xpress-core/router';

export default function ProductDetail() {
  const router = useRouter();
  const route = useRoute();

  // 从路由参数中获取产品ID
  const productId = route.params.id;

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">产品详情</h1>
      <div className="mb-4">
        <p>产品ID: {productId}</p>
      </div>
      <div className="flex gap-4">
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white"
          onClick={() => router.push({ path: '/products' })}
        >
          返回列表
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
