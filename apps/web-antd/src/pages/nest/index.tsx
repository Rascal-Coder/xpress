import { Outlet } from '@xpress-core/router';

import React from 'react';

const Nest: React.FC = () => {
  return (
    <div>
      <h1>嵌套路由示例</h1>
      <Outlet />
    </div>
  );
};

export default Nest;
