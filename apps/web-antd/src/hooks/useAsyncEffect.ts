import React, { useEffect } from 'react';

const useAsyncEffect = (effect: () => any, deps?: React.DependencyList) => {
  useEffect(() => {
    (async () => {
      await effect();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useAsyncEffect;
