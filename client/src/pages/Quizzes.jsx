import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '../api/client';
import DifficultyTag from '../components/DifficultyTag';
import ScoreBadge from '../components/ScoreBadge';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { CATEGORIES, DIFFICULTIES } from '../utils/constants';

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState(null);
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');

  useEffect(() => {
    setQuizzes(null);
    api
      .get('/quizzes', { params: { category: category || undefined, difficulty: difficulty || undefined } })
      .then((r) => setQuizzes(r.data.quizzes))
      .catch((e) => {
        toast.error(getErrorMessage(e));
        setQuizzes([]);
      });
  }, [category, difficulty]);

  return (
    <div className="stack-lg">
      <header className="page-head">
        <div>
          <h1>Quizzes</h1>
          <p className="muted">Timed multiple-choice quizzes. Results and explanations appear as soon as you submit.</p>
        </div>
        <Link to="/history" className="btn btn-ghost">Your results</Link>
      </header>

      <div className="filters">
        <label className="field">
          <span>Topic</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All topics</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Difficulty</span>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="">Any</option>
            {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
          </select>
        </label>
      </div>

      {!quizzes ? (
        <Loader />
      ) : quizzes.length === 0 ? (
        <EmptyState title="No quizzes here yet">Try a different topic or difficulty.</EmptyState>
      ) : (
        <div className="quiz-grid">
          {quizzes.map((q) => (
            <article key={q._id} className="quiz-tile">
              <div className="index-card-meta">
                <span>{q.category}</span>
                <DifficultyTag level={q.difficulty} />
              </div>
              <h2>{q.title}</h2>
              {q.description && <p className="muted">{q.description}</p>}
              <dl className="quiz-facts">
                <div><dt>Questions</dt><dd>{q.questionCount}</dd></div>
                <div><dt>Time limit</dt><dd>{q.timeLimit} min</dd></div>
                <div>
                  <dt>Your best</dt>
                  <dd>{q.bestScore === null ? 'Not taken' : <ScoreBadge percentage={q.bestScore} />}</dd>
                </div>
              </dl>
              <Link to={`/quizzes/${q._id}`} className="btn btn-primary">
                {q.attempts > 0 ? 'Retake quiz' : 'Start quiz'}
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
