import React from 'react';
import { Outlet } from 'react-router-dom';

const Nest: React.FC = () => {
  return (
    <div>
      <h1>嵌套路由示例</h1>
      <Outlet />
    </div>
  );
};

export default Nest;
