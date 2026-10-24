import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import ScoreBadge from '../components/ScoreBadge';
import { formatDate, formatDuration } from '../utils/format';

export default function History() {
  const [attempts, setAttempts] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/quizzes/attempts/me').then((r) => setAttempts(r.data.attempts)).catch((e) => setError(getErrorMessage(e)));
  }, []);

  if (error) return <EmptyState title="Couldn't load your results">{error}</EmptyState>;
  if (!attempts) return <Loader />;

  return (
    <div className="stack-lg">
      <header className="page-head">
        <div>
          <h1>Quiz results</h1>
          <p className="muted">Every quiz you've taken, newest first.</p>
        </div>
      </header>
      {attempts.length === 0 ? (
        <EmptyState title="No results yet" action={<Link to="/quizzes" className="btn btn-outline btn-sm">Take a quiz</Link>}>
          Finish a quiz and your score will be saved here.
        </EmptyState>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Quiz</th>
                <th scope="col">Topic</th>
                <th scope="col">Score</th>
                <th scope="col">Time</th>
                <th scope="col">Date</th>
                <th scope="col"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((a) => (
                <tr key={a._id}>
                  <td>{a.quizTitle}</td>
                  <td className="muted">{a.category}</td>
                  <td>
                    {a.score}/{a.total} <ScoreBadge percentage={a.percentage} />
                  </td>
                  <td>{formatDuration(a.timeTaken)}</td>
                  <td>{formatDate(a.createdAt)}</td>
                  <td><Link to={`/results/${a._id}`}>Review</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
