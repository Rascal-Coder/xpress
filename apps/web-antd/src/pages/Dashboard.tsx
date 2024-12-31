import { Outlet } from '@tanstack/react-router';

export default function Dashboard() {
  return (
    <div>
      <h1>仪表盘</h1>
      <Outlet />
    </div>
  );
}
