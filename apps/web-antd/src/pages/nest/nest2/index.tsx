import React from 'react';
import { Outlet } from 'react-router-dom';

const Nest2: React.FC = () => {
  return (
    <div>
      <h2>菜单2</h2>
      <Outlet />
    </div>
  );
};

export default Nest2;
