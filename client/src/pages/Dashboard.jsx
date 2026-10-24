import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import ProgressBar from '../components/ProgressBar';
import ScoreBadge from '../components/ScoreBadge';
import { firstName, formatDate } from '../utils/format';

function Stat({ value, label }) {
  return (
    <div className="stat">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/users/dashboard').then((r) => setData(r.data)).catch((e) => setError(getErrorMessage(e)));
  }, []);

  if (error) return <EmptyState title="Couldn't load your dashboard">{error}</EmptyState>;
  if (!data) return <Loader />;

  const overall = data.totalQuestions ? Math.round((data.practicedCount / data.totalQuestions) * 100) : 0;

  return (
    <div className="stack-lg">
      <header className="page-head">
        <div>
          <h1>Hi, {firstName(user.name)}</h1>
          <p className="muted">
            {user.targetRole ? (
              <>Preparing for {user.targetRole}</>
            ) : (
              <>Add the role you're preparing for in your <Link to="/profile">profile</Link>.</>
            )}
          </p>
        </div>
        <Link to="/questions?status=pending" className="btn btn-primary">Practice a new question</Link>
      </header>

      <section className="stat-row" aria-label="Your numbers">
        <Stat value={`${data.practicedCount}/${data.totalQuestions}`} label="Questions practiced" />
        <Stat value={data.quizzesTaken} label="Quizzes taken" />
        <Stat value={data.quizzesTaken ? `${data.averageScore}%` : '–'} label="Average quiz score" />
        <Stat value={data.bookmarkCount} label="Bookmarked questions" />
      </section>

      <div className="two-col">
        <section className="panel">
          <div className="panel-head">
            <h2>Progress by topic</h2>
            <span className="muted small">{overall}% overall</span>
          </div>
          {data.categories.length === 0 ? (
            <EmptyState title="No questions yet">An admin needs to add questions first.</EmptyState>
          ) : (
            <div className="stack-sm">
              {data.categories.map((c) => (
                <ProgressBar
                  key={c.name}
                  label={c.name}
                  value={c.practiced}
                  max={c.total}
                  to={`/questions?category=${encodeURIComponent(c.name)}`}
                />
              ))}
            </div>
          )}
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>Recent quizzes</h2>
            {data.recentAttempts.length > 0 && <Link to="/history" className="small">See all results</Link>}
          </div>
          {data.recentAttempts.length === 0 ? (
            <EmptyState
              title="No quiz results yet"
              action={<Link to="/quizzes" className="btn btn-outline btn-sm">Take a quiz</Link>}
            >
              Your scores will appear here after your first quiz.
            </EmptyState>
          ) : (
            <ul className="row-list">
              {data.recentAttempts.map((a) => (
                <li key={a._id}>
                  <Link to={`/results/${a._id}`} className="row-link">
                    <span>
                      <strong>{a.quizTitle}</strong>
                      <span className="muted small block">{formatDate(a.createdAt)}</span>
                    </span>
                    <ScoreBadge percentage={a.percentage} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {data.quizzesTaken > 0 && <p className="small muted">Best score so far: {data.bestScore}%</p>}
        </section>
      </div>
    </div>
  );
}
