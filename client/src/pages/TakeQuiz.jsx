import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '../api/client';
import DifficultyTag from '../components/DifficultyTag';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { formatDuration } from '../utils/format';

export default function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState('');
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const startedAt = useRef(0);
  const submitted = useRef(false);
  const answersRef = useRef(answers);
  answersRef.current = answers;

  useEffect(() => {
    api
      .get(`/quizzes/${id}`)
      .then(({ data }) => {
        setQuiz(data.quiz);
        setAnswers(Array(data.quiz.questions.length).fill(null));
        setSecondsLeft(data.quiz.timeLimit * 60);
      })
      .catch((e) => setError(getErrorMessage(e)));
  }, [id]);

  const submit = useCallback(
    async (finalAnswers) => {
      if (submitted.current) return;
      submitted.current = true;
      setSubmitting(true);
      try {
        const timeTaken = Math.round((Date.now() - startedAt.current) / 1000);
        const { data } = await api.post(`/quizzes/${id}/submit`, { answers: finalAnswers, timeTaken });
        navigate(`/results/${data.attemptId}`, { replace: true });
      } catch (e) {
        submitted.current = false;
        setSubmitting(false);
        toast.error(getErrorMessage(e));
      }
    },
    [id, navigate]
  );

  // Countdown based on a fixed deadline so it doesn't drift
  useEffect(() => {
    if (!started) return undefined;
    const deadline = startedAt.current + quiz.timeLimit * 60 * 1000;
    const timer = setInterval(() => {
      setSecondsLeft(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
    }, 250);
    return () => clearInterval(timer);
  }, [started, quiz]);

  useEffect(() => {
    if (started && secondsLeft === 0 && !submitted.current) {
      toast('Time is up. Submitting your answers.');
      submit(answersRef.current);
    }
  }, [secondsLeft, started, submit]);

  // Warn before closing the tab mid-quiz
  useEffect(() => {
    if (!started) return undefined;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [started]);

  if (error) {
    return (
      <EmptyState title="Couldn't open this quiz" action={<Link to="/quizzes" className="btn btn-outline btn-sm">Back to quizzes</Link>}>
        {error}
      </EmptyState>
    );
  }
  if (!quiz) return <Loader />;

  const total = quiz.questions.length;

  if (!started) {
    return (
      <div className="quiz-intro panel">
        <div className="index-card-meta">
          <span>{quiz.category}</span>
          <DifficultyTag level={quiz.difficulty} />
        </div>
        <h1>{quiz.title}</h1>
        {quiz.description && <p className="muted">{quiz.description}</p>}
        <ul className="plain-list">
          <li>{total} multiple-choice questions</li>
          <li>{quiz.timeLimit} minutes. The quiz submits itself when the timer reaches zero.</li>
          <li>You can move between questions and change answers before submitting.</li>
        </ul>
        <div className="form-actions">
          <Link to="/quizzes" className="btn btn-ghost">Back to quizzes</Link>
          <button
            className="btn btn-primary"
            onClick={() => {
              startedAt.current = Date.now();
              setStarted(true);
            }}
          >
            Start the timer
          </button>
        </div>
      </div>
    );
  }

  const q = quiz.questions[current];
  const unanswered = answers.filter((a) => a === null).length;

  const choose = (optionIndex) =>
    setAnswers((prev) => prev.map((a, i) => (i === current ? optionIndex : a)));

  const handleSubmit = () => {
    if (unanswered > 0 && !window.confirm(`${unanswered} ${unanswered === 1 ? 'question is' : 'questions are'} unanswered. Submit anyway?`)) return;
    submit(answers);
  };

  return (
    <div className="quiz-shell">
      <header className="quiz-bar">
        <div>
          <p className="quiz-title">{quiz.title}</p>
          <p className="muted small">Question {current + 1} of {total}</p>
        </div>
        <div className={`timer${secondsLeft <= 30 ? ' timer-low' : ''}`} role="timer" aria-label="Time remaining">
          {formatDuration(secondsLeft)}
        </div>
      </header>

      <nav className="quiz-dots" aria-label="Jump to question">
        {quiz.questions.map((item, i) => (
          <button
            key={item._id}
            className={`dot${i === current ? ' dot-current' : ''}${answers[i] !== null ? ' dot-answered' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Question ${i + 1}${answers[i] !== null ? ', answered' : ''}`}
            aria-current={i === current ? 'step' : undefined}
          >
            {i + 1}
          </button>
        ))}
      </nav>

      <fieldset className="quiz-question" key={q._id}>
        <legend>{q.question}</legend>
        {q.options.map((opt, oi) => (
          <label key={oi} className={`option${answers[current] === oi ? ' option-selected' : ''}`}>
            <input type="radio" name={`q-${q._id}`} checked={answers[current] === oi} onChange={() => choose(oi)} />
            <span className="option-letter" aria-hidden="true">{String.fromCharCode(65 + oi)}</span>
            <span>{opt}</span>
          </label>
        ))}
      </fieldset>

      <div className="quiz-nav">
        <button className="btn btn-ghost" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>
          Previous
        </button>
        {current < total - 1 ? (
          <button className="btn btn-primary" onClick={() => setCurrent((c) => c + 1)}>Next question</button>
        ) : (
          <button className="btn btn-primary" disabled={submitting} onClick={handleSubmit}>
            {submitting ? 'Submitting…' : 'Submit quiz'}
          </button>
        )}
      </div>
      {current < total - 1 && (
        <p className="small muted center">
          Done early?{' '}
          <button className="link-button" disabled={submitting} onClick={handleSubmit}>Submit now</button>
        </p>
      )}
    </div>
  );
}
