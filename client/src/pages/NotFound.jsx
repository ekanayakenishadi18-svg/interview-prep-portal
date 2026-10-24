import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';

export default function NotFound() {
  return (
    <EmptyState title="This page doesn't exist" action={<Link to="/" className="btn btn-outline btn-sm">Go to the home page</Link>}>
      Check the address, or head back and pick up from there.
    </EmptyState>
  );
}
