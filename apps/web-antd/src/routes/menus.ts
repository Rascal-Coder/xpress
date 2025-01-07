import type { MenuRecordRaw } from '@xpress-core/typings';

// 定义菜单数据
export const menus: MenuRecordRaw[] = [
  {
    name: '仪表盘',
    path: 'root-dashboard',
    children: [
      {
        name: '分析页',
        path: '/analysis',
      },
      {
        name: '工作台',
        path: '/workbench',
        badge: '新',
        badgeType: 'normal',
        badgeVariants: 'destructive',
      },
    ],
  },
  {
    name: '嵌套路由',
    path: 'root-nested',
    children: [
      {
        name: '嵌套路由1',
        path: '/nested/1',
        children: [
          {
            name: '嵌套路由1-1',
            path: '/nested/1/1',
          },
        ],
      },
      {
        name: '嵌套路由2',
        path: '/nested/2',
      },
    ],
  },
  {
    name: '系统设置',
    path: '/settings',
  },
];
