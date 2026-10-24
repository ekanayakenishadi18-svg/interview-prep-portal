import { Link } from 'react-router-dom';

export default function ProgressBar({ label, value, max, to }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  const body = (
    <>
      <div className="progress-label">
        <span>{label}</span>
        <span className="muted small">
          {value} of {max}
        </span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
      >
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </>
  );
  return to ? (
    <Link to={to} className="progress progress-link">{body}</Link>
  ) : (
    <div className="progress">{body}</div>
  );
}
