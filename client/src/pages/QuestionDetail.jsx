import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import useQuestionActions from '../hooks/useQuestionActions';
import DifficultyTag from '../components/DifficultyTag';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

export default function QuestionDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [error, setError] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [draft, setDraft] = useState('');
  const actions = useQuestionActions();

  useEffect(() => {
    setQuestion(null);
    setShowAnswer(false);
    setDraft('');
    api
      .get(`/questions/${id}`)
      .then((r) => setQuestion(r.data.question))
      .catch((e) => setError(getErrorMessage(e)));
  }, [id]);

  if (error) {
    return (
      <EmptyState
        title="Couldn't open this question"
        action={<Link to="/questions" className="btn btn-outline btn-sm">Back to questions</Link>}
      >
        {error}
      </EmptyState>
    );
  }
  if (!question) return <Loader />;

  const practiced = actions.isPracticed(question._id);
  const bookmarked = actions.isBookmarked(question._id);

  return (
    <div className="detail">
      <Link to="/questions" className="back-link">Back to questions</Link>

      <article className={`index-card index-card-lg${practiced ? ' is-practiced' : ''}`}>
        <div className="index-card-meta">
          <span>{question.category}</span>
          <DifficultyTag level={question.difficulty} />
          {question.company && <span className="muted">{question.company}</span>}
        </div>
        <h1 className="index-card-title">
          <span className="hl">{question.title}</span>
        </h1>

        <label className="field">
          <span>Your answer</span>
          <textarea
            rows={5}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write or outline your answer here before checking. This isn't saved."
          />
        </label>

        {showAnswer && (
          <section className="model-answer reveal" aria-label="Model answer">
            <h2>Model answer</h2>
            <p className="answer-text">{question.answer}</p>
          </section>
        )}

        <div className="index-card-actions">
          <button className="btn btn-primary" aria-expanded={showAnswer} onClick={() => setShowAnswer((s) => !s)}>
            {showAnswer ? 'Hide model answer' : 'Show model answer'}
          </button>
          <button className={`chip${practiced ? ' chip-on' : ''}`} aria-pressed={practiced} onClick={() => actions.togglePractice(question._id)}>
            {practiced ? 'Practiced' : 'Mark practiced'}
          </button>
          <button className={`chip${bookmarked ? ' chip-on' : ''}`} aria-pressed={bookmarked} onClick={() => actions.toggleBookmark(question._id)}>
            {bookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>
        </div>

        {question.tags?.length > 0 && (
          <ul className="tag-list" aria-label="Tags">
            {question.tags.map((t) => (
              <li key={t}>
                <Link to={`/questions?search=${encodeURIComponent(t)}`}>#{t}</Link>
              </li>
            ))}
          </ul>
        )}
      </article>
    </div>
  );
}
