// import { usePreferencesContext } from '@xpress-core/preferences';
// import { Router } from '@xpress-core/router';

// import { createContext, useContext, useEffect, useState } from 'react';

// import { generateAccessRoutes } from './access';

// interface RouterContextType {
//   router: Router | undefined;
// }

// export const RouterContext = createContext<RouterContextType>({
//   router: undefined,
// });

// export const useRouterContext = () => {
//   const context = useContext(RouterContext);
//   if (!context) {
//     throw new Error('useRouter must be used within a RouterProvider');
//   }
//   return context;
// };

// export const AuthRouter = ({ children }: { children: React.ReactNode }) => {
//   const { preferences } = usePreferencesContext();
//   const [router, setRouter] = useState<Router>();
//   const genRoutes = async () => {
//     const { accessibleRoutes } = await generateAccessRoutes(
//       preferences.app.accessMode,
//     );
//     const router = new Router(accessibleRoutes);

//     setRouter(router);
//     console.log('router', router);
//   };
//   useEffect(() => {
//     console.log('xxxxx');
//     // genRoutes();
//   }, []);

//   return (
//     <RouterContext.Provider value={{ router }}>
//       {children}
//     </RouterContext.Provider>
//   );
// };
export default function AuthRouter({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
