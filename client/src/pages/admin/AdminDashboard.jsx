import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../../api/client';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { formatDate } from '../../utils/format';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/users/admin/stats').then((r) => setData(r.data)).catch((e) => setError(getErrorMessage(e)));
  }, []);

  if (error) return <EmptyState title="Couldn't load admin stats">{error}</EmptyState>;
  if (!data) return <Loader />;

  const { counts, recentUsers } = data;
  const sections = [
    { to: '/admin/questions', title: 'Questions', count: counts.questions, text: 'Add, edit and remove questions in the bank.' },
    { to: '/admin/quizzes', title: 'Quizzes', count: counts.quizzes, text: 'Build quizzes, set time limits and publish them.' },
    { to: '/admin/users', title: 'Users', count: counts.users, text: 'Change roles and remove accounts.' },
  ];

  return (
    <div className="stack-lg">
      <header className="page-head">
        <div>
          <h1>Admin</h1>
          <p className="muted">
            {counts.attempts} quiz attempts and {counts.experiences} shared experiences so far.
          </p>
        </div>
      </header>

      <div className="admin-sections">
        {sections.map((s) => (
          <Link key={s.to} to={s.to} className="admin-section">
            <span className="stat-value">{s.count}</span>
            <strong>{s.title}</strong>
            <span className="muted small">{s.text}</span>
          </Link>
        ))}
      </div>

      <section className="panel">
        <h2>Newest accounts</h2>
        <ul className="row-list">
          {recentUsers.map((u) => (
            <li key={u._id} className="row-link">
              <span>
                <strong>{u.name}</strong>
                <span className="muted small block">{u.email}</span>
              </span>
              <span className="small muted">
                {u.role === 'admin' ? 'Admin, ' : ''}joined {formatDate(u.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
