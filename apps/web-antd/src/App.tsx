import { unmountGlobalLoading } from '@xpress/utils';

import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // 在组件挂载后移除loading
    unmountGlobalLoading();
  }, []);

  return (
    <>
      <div>Hello Xpress</div>
    </>
  );
}

export default App;
