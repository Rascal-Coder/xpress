import { useRouter } from '@xpress-core/router';

export default function Home() {
  const router = useRouter();

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">首页</h1>
      <div className="flex gap-4">
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white"
          onClick={() => router.push({ path: '/about' })}
        >
          去关于页面
        </button>
        <button
          className="rounded bg-green-500 px-4 py-2 text-white"
          onClick={() => router.push({ path: '/admin' })}
        >
          去管理页面
        </button>
      </div>
    </div>
  );
}
