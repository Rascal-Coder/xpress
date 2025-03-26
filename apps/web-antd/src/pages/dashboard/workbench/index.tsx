import { Button } from '@xpress-core/shadcn-ui';

import { useState } from 'react';

export default function Workbench() {
  const [count, setCount] = useState(0);
  return <Button onClick={() => setCount(count + 1)}>{count}</Button>;
}
