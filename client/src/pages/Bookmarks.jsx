import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import useQuestionActions from '../hooks/useQuestionActions';
import QuestionCard from '../components/QuestionCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

export default function Bookmarks() {
  const [questions, setQuestions] = useState(null);
  const [error, setError] = useState('');
  const actions = useQuestionActions();

  useEffect(() => {
    api.get('/questions/bookmarks').then((r) => setQuestions(r.data.questions)).catch((e) => setError(getErrorMessage(e)));
  }, []);

  const removeBookmark = async (id) => {
    const stillBookmarked = await actions.toggleBookmark(id);
    if (stillBookmarked === false) setQuestions((qs) => qs.filter((q) => q._id !== id));
  };

  if (error) return <EmptyState title="Couldn't load bookmarks">{error}</EmptyState>;
  if (!questions) return <Loader />;

  return (
    <div className="stack-lg">
      <header className="page-head">
        <div>
          <h1>Bookmarks</h1>
          <p className="muted">Questions you've saved to come back to.</p>
        </div>
      </header>
      {questions.length === 0 ? (
        <EmptyState
          title="No bookmarks yet"
          action={<Link to="/questions" className="btn btn-outline btn-sm">Browse questions</Link>}
        >
          Bookmark a question from the question bank and it will show up here.
        </EmptyState>
      ) : (
        <div className="card-list">
          {questions.map((q) => (
            <QuestionCard
              key={q._id}
              question={q}
              practiced={actions.isPracticed(q._id)}
              bookmarked
              onTogglePractice={() => actions.togglePractice(q._id)}
              onToggleBookmark={() => removeBookmark(q._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
