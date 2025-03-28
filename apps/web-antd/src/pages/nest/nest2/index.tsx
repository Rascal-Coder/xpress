import { Outlet } from '@xpress-core/router';

import React from 'react';

const Nest2: React.FC = () => {
  return (
    <div>
      <h2>菜单2</h2>
      <Outlet />
    </div>
  );
};

export default Nest2;
