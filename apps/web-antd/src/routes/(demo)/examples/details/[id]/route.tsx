// import type { Route } from './+types/details';

import { Link } from 'react-router';
// Route.ComponentProps
export default function Component({ params }: any) {
  const { id } = params;

  return (
    <div>
      <div>ExampleDetail</div>
      <div>id: {id}</div>
      <div>
        <Link to="/examples">返回</Link>
      </div>
    </div>
  );
}
