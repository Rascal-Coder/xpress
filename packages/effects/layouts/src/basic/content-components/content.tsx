import { useTabbar } from '@xpress/stores';
import { type Router, useFullPath, useRouter } from '@xpress-core/router';
import { Outlet } from '@xpress-core/router';

import KeepAlive from 'react-activation';

function Content({ router }: { router: Router }) {
  const { curRoute } = useRouter(router);
  const keepAlive = curRoute?.meta?.keepAlive;
  const fullPath = useFullPath();
  const { refreshing } = useTabbar();
  return keepAlive ? (
    <KeepAlive cacheKey={fullPath}>{refreshing ? null : <Outlet />}</KeepAlive>
  ) : (
    !refreshing && <Outlet />
  );
}
export default Content;
