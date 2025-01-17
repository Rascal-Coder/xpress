import { redirect } from 'react-router';

export async function clientLoader() {
  return redirect('/analytics');
}

export default function Index() {
  return null;
}

// clientLoader.hydrate = true as const;
// routes/_layout 文件是布局文件，用于定义布局组件
// routes/_index.tsx 是/根路由
// (xxxx)用来分组无关路径
// []用来做动态路由参数
// node 会生成 tree  imports transform
