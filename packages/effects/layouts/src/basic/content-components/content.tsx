import { Outlet, type Router, useFullPath, useRouter } from '@xpress/router';
import { useTabbar } from '@xpress/stores';
import { type AnimationDirection, useAnimation } from '@xpress-core/hooks';
import { usePreferencesContext } from '@xpress-core/preferences';

import { motion } from 'framer-motion';
import { memo } from 'react';
import KeepAlive from 'react-activation';

const OutContent = memo(() => {
  const fullPath = useFullPath();
  const { preferences } = usePreferencesContext();
  const animation = useAnimation(
    preferences.transition.name as AnimationDirection,
  );

  return (
    <motion.div
      animate={preferences.transition.enable ? 'visible' : undefined}
      className="relative h-full w-full"
      initial={preferences.transition.enable ? 'hidden' : undefined}
      key={fullPath}
      variants={preferences.transition.enable ? animation : undefined}
    >
      <Outlet />
    </motion.div>
  );
});

OutContent.displayName = 'OutContent';

function Content({ router }: { router: Router }) {
  const { curRoute } = useRouter(router);
  const keepAlive = curRoute?.meta?.keepAlive;
  const fullPath = useFullPath();
  const { refreshing } = useTabbar();

  return keepAlive ? (
    <KeepAlive cacheKey={fullPath}>
      {refreshing ? null : <OutContent />}
    </KeepAlive>
  ) : (
    !refreshing && <OutContent />
  );
}

export default Content;
