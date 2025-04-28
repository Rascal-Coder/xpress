import type { RouteConfig } from '@xpress-core/typings';

const routes: RouteConfig[] = [
  {
    path: 'examples',
    meta: {
      title: '示例',
      icon: 'ion:layers-outline',
      order: 1000,
    },
    defaultPath: 'table',
    children: [
      {
        path: 'table',
        meta: {
          title: '表格',
          icon: 'lucide:table',
          order: 1001,
        },
        defaultPath: 'basic',
        children: [
          {
            path: 'basic',
            meta: {
              title: '基础表格',
            },
            component: () => import('#/pages/table/basic'),
          },
          {
            path: 'remote',
            meta: {
              title: '远程数据',
            },
            component: () => import('#/pages/table/remote'),
          },
          {
            path: 'custom-cell',
            meta: {
              title: '自定义单元格',
            },
            component: () => import('#/pages/table/custom-cell'),
          },
          {
            path: 'edit-cell',
            meta: {
              title: '编辑单元格',
            },
            component: () => import('#/pages/table/edit-cell'),
          },
          {
            path: 'edit-row',
            meta: {
              title: '编辑行',
            },
            component: () => import('#/pages/table/edit-row'),
          },
          {
            path: 'filters',
            meta: {
              title: '搜索表格',
            },
            component: () => import('#/pages/table/filters'),
          },
          {
            path: 'fixed',
            meta: {
              title: '固定表头/列',
            },
            component: () => import('#/pages/table/fixed'),
          },

          {
            path: 'tree',
            meta: {
              title: '树形表格',
            },
            component: () => import('#/pages/table/tree'),
          },
          {
            path: 'virtual',
            meta: {
              title: '虚拟滚动',
            },
            component: () => import('#/pages/table/virtual'),
          },
        ],
      },
    ],
  },
];

export default routes;
