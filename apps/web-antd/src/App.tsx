import { unmountGlobalLoading } from '@xpress/utils';

import { useEffect } from 'react';

function App() {
  useEffect(() => {
    unmountGlobalLoading();
  }, []);

  return <div>App</div>;
}

export default App;
