import Layout from '#/pages/layouts/base';

import { menus } from './menus';

export function RootLayout() {
  return <Layout menus={menus}></Layout>;
}
