import { useRoute, useRouter } from '@xpress-core/router';

// import React from 'react';

export default function About() {
  const router = useRouter();
  const route = useRoute();

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">关于页面</h1>
      <div className="mb-4">当前路径: {route.path}</div>
      <button
        className="rounded bg-blue-500 px-4 py-2 text-white"
        onClick={() => router.push({ path: '/' })}
      >
        返回首页
      </button>
    </div>
  );
}
