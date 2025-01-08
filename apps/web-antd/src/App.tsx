import { RouterProvider } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import { router } from './routes';

function App() {
  return (
    <div className="h-full w-full overscroll-none text-inherit">
      <RouterProvider router={router} />
      <TanStackRouterDevtools position="bottom-right" router={router} />
    </div>
  );
}

export default App;
