import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { formatDate, formatDuration } from '../utils/format';

const verdict = (pct) => {
  if (pct >= 80) return 'Strong result. You know this topic well.';
  if (pct >= 50) return 'Solid base. Review the questions you missed below.';
  return 'Worth revisiting. Read the explanations, then try again.';
};

export default function QuizResult() {
  const { attemptId } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/quizzes/attempts/${attemptId}`).then((r) => setAttempt(r.data.attempt)).catch((e) => setError(getErrorMessage(e)));
  }, [attemptId]);

  if (error) return <EmptyState title="Couldn't load this result">{error}</EmptyState>;
  if (!attempt) return <Loader />;

  return (
    <div className="stack-lg">
      <section className="result-head panel">
        <div>
          <p className="muted small">{attempt.quizTitle}</p>
          <h1 className="result-score">
            {attempt.score} out of {attempt.total}
          </h1>
          <p>{verdict(attempt.percentage)}</p>
        </div>
        <dl className="quiz-facts">
          <div><dt>Score</dt><dd>{attempt.percentage}%</dd></div>
          <div><dt>Time taken</dt><dd>{formatDuration(attempt.timeTaken)}</dd></div>
          <div><dt>Taken on</dt><dd>{formatDate(attempt.createdAt)}</dd></div>
        </dl>
        <div className="form-actions">
          <Link to="/quizzes" className="btn btn-ghost">All quizzes</Link>
          {attempt.quiz && <Link to={`/quizzes/${attempt.quiz}`} className="btn btn-primary">Retake quiz</Link>}
        </div>
      </section>

      <section className="stack">
        <h2>Review your answers</h2>
        <ol className="review-list">
          {attempt.responses.map((r, i) => (
            <li key={i} className={`review-item ${r.isCorrect ? 'is-correct' : 'is-wrong'}`}>
              <p className="review-question">{r.question}</p>
              <ul className="review-options">
                {r.options.map((opt, oi) => {
                  const isAnswer = oi === r.correctIndex;
                  const isPicked = oi === r.selectedIndex;
                  return (
                    <li key={oi} className={`${isAnswer ? 'opt-correct' : ''}${isPicked && !isAnswer ? ' opt-wrong' : ''}`}>
                      <span>{opt}</span>
                      {isAnswer && <span className="opt-note">Correct answer</span>}
                      {isPicked && !isAnswer && <span className="opt-note">Your answer</span>}
                    </li>
                  );
                })}
              </ul>
              {r.selectedIndex === -1 && <p className="small muted">You didn't answer this one.</p>}
              {r.explanation && <p className="explanation">{r.explanation}</p>}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
