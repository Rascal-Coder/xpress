import { Link } from 'react-router';

export default function ExamplesPage() {
  return (
    <div>
      <h1>示例</h1>
      <br />
      <Link to="/examples/details/1">示例1</Link>
      <br />
      <Link to="/examples/details/2">示例2</Link>
    </div>
  );
}
