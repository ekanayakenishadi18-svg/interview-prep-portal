export default function Loader({ label = 'Loading' }) {
  return (
    <div className="loader" role="status">
      <span className="loader-card" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
