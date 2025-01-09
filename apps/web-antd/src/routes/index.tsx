import { Navigate, Route, Routes } from 'react-router-dom';

import { dashboardRoutes } from './modules/dashboard';
import { settingsRoutes } from './modules/settings';
import { RootLayout } from './root';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route element={<Navigate replace to="/analysis" />} path="/" />
        {dashboardRoutes.map((route) => (
          <Route element={route.element} key={route.path} path={route.path} />
        ))}
        {settingsRoutes.map((route) => (
          <Route element={route.element} key={route.path} path={route.path} />
        ))}
      </Route>
    </Routes>
  );
}
