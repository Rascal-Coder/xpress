import React from 'react';
import { Outlet } from 'react-router-dom';

const Nest2_2: React.FC = () => {
  return (
    <div>
      <h3>菜单2-2</h3>
      <Outlet />
    </div>
  );
};

export default Nest2_2;
