import type { MenuRecordRaw } from '@xpress-core/typings';

export const menus: MenuRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'dashboard',
    children: [
      {
        path: '/analytics',
        name: 'analytics',
      },
      {
        path: '/workbench',
        name: 'workbench',
      },
    ],
  },
  {
    path: '/demo',
    name: 'demo',
    children: [
      {
        path: '/examples',
        name: 'examples',
      },
    ],
  },
  {
    path: '/nested',
    name: 'nested',
    children: [
      {
        path: '/nested1',
        name: 'nested1',
        children: [
          {
            path: '/nested1/nested1-1',
            name: 'nested1-1',
          },
          {
            path: '/nested1/nested1-2',
            name: 'nested1-2',
          },
        ],
      },
      {
        path: '/nested2',
        name: 'nested2',
      },
    ],
  },
  {
    path: '/about',
    name: 'about',
  },
];
