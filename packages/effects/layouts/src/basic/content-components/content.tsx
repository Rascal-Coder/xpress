import { memo, Suspense } from 'react';
import { Outlet } from 'react-router';

function Content() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Outlet />
    </Suspense>
  );
}
const MemoContent = memo(Content);
MemoContent.displayName = 'MemoContent';
export default MemoContent;
