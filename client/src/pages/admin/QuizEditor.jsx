import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '../../api/client';
import Loader from '../../components/Loader';
import { CATEGORIES, DIFFICULTIES } from '../../utils/constants';

const blankQuestion = () => ({ question: '', options: ['', '', '', ''], correctIndex: 0, explanation: '' });

const EMPTY_QUIZ = {
  title: '',
  description: '',
  category: CATEGORIES[0],
  difficulty: 'Medium',
  timeLimit: 10,
  isPublished: true,
  questions: [blankQuestion()],
};

const validate = (quiz) => {
  if (!quiz.title.trim()) return 'Give the quiz a title.';
  for (let i = 0; i < quiz.questions.length; i += 1) {
    const q = quiz.questions[i];
    if (!q.question.trim()) return `Question ${i + 1} needs text.`;
    if (q.options.some((o) => !o.trim())) return `Question ${i + 1} has an empty option.`;
  }
  return '';
};

export default function QuizEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(isEdit ? null : EMPTY_QUIZ);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/quizzes/${id}/full`).then((r) => setQuiz(r.data.quiz)).catch((e) => setError(getErrorMessage(e)));
  }, [id, isEdit]);

  if (!quiz) return error ? <p className="form-error">{error}</p> : <Loader />;

  const setField = (field, value) => setQuiz((q) => ({ ...q, [field]: value }));

  const updateQuestion = (qi, patch) =>
    setQuiz((q) => ({ ...q, questions: q.questions.map((item, i) => (i === qi ? { ...item, ...patch } : item)) }));

  const updateOption = (qi, oi, value) =>
    updateQuestion(qi, { options: quiz.questions[qi].options.map((o, i) => (i === oi ? value : o)) });

  const addOption = (qi) => updateQuestion(qi, { options: [...quiz.questions[qi].options, ''] });

  const removeOption = (qi, oi) => {
    const q = quiz.questions[qi];
    let correctIndex = q.correctIndex;
    if (oi === correctIndex) correctIndex = 0;
    else if (oi < correctIndex) correctIndex -= 1;
    updateQuestion(qi, { options: q.options.filter((_, i) => i !== oi), correctIndex });
  };

  const addQuestion = () => setQuiz((q) => ({ ...q, questions: [...q.questions, blankQuestion()] }));
  const removeQuestion = (qi) => setQuiz((q) => ({ ...q, questions: q.questions.filter((_, i) => i !== qi) }));

  const save = async (e) => {
    e.preventDefault();
    const problem = validate(quiz);
    if (problem) return setError(problem);
    setError('');
    setSaving(true);
    const payload = {
      title: quiz.title,
      description: quiz.description,
      category: quiz.category,
      difficulty: quiz.difficulty,
      timeLimit: Number(quiz.timeLimit),
      isPublished: quiz.isPublished,
      questions: quiz.questions,
    };
    try {
      if (isEdit) await api.put(`/quizzes/${id}`, payload);
      else await api.post('/quizzes', payload);
      toast.success(isEdit ? 'Quiz saved' : 'Quiz created');
      navigate('/admin/quizzes');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="stack-lg" onSubmit={save}>
      <header className="page-head">
        <div>
          <Link to="/admin/quizzes" className="back-link">Manage quizzes</Link>
          <h1>{isEdit ? 'Edit quiz' : 'Create a quiz'}</h1>
        </div>
      </header>

      <section className="panel form-grid">
        <label className="field span-2">
          <span>Title</span>
          <input value={quiz.title} onChange={(e) => setField('title', e.target.value)} maxLength={120} required />
        </label>
        <label className="field span-2">
          <span>Description</span>
          <textarea rows={2} value={quiz.description} onChange={(e) => setField('description', e.target.value)} maxLength={500} />
        </label>
        <label className="field">
          <span>Topic</span>
          <select value={quiz.category} onChange={(e) => setField('category', e.target.value)}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Difficulty</span>
          <select value={quiz.difficulty} onChange={(e) => setField('difficulty', e.target.value)}>
            {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Time limit (minutes)</span>
          <input type="number" min={1} max={120} value={quiz.timeLimit} onChange={(e) => setField('timeLimit', e.target.value)} />
        </label>
        <label className="check">
          <input type="checkbox" checked={quiz.isPublished} onChange={(e) => setField('isPublished', e.target.checked)} />
          Published (visible to students)
        </label>
      </section>

      <section className="stack">
        <h2>Questions ({quiz.questions.length})</h2>
        {quiz.questions.map((q, qi) => (
          <fieldset key={q._id || qi} className="panel mcq-editor">
            <legend>Question {qi + 1}</legend>
            <label className="field">
              <span>Question text</span>
              <textarea rows={2} value={q.question} onChange={(e) => updateQuestion(qi, { question: e.target.value })} />
            </label>
            <div className="stack-sm">
              <span className="field-label">Options (select the correct one)</span>
              {q.options.map((opt, oi) => (
                <div key={oi} className="option-edit">
                  <input
                    type="radio"
                    name={`correct-${qi}`}
                    checked={q.correctIndex === oi}
                    onChange={() => updateQuestion(qi, { correctIndex: oi })}
                    aria-label={`Mark option ${String.fromCharCode(65 + oi)} as correct`}
                  />
                  <input
                    value={opt}
                    onChange={(e) => updateOption(qi, oi, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                    aria-label={`Option ${String.fromCharCode(65 + oi)}`}
                  />
                  <button type="button" className="btn btn-ghost btn-sm" disabled={q.options.length <= 2} onClick={() => removeOption(qi, oi)}>
                    Remove
                  </button>
                </div>
              ))}
              {q.options.length < 6 && (
                <button type="button" className="link-button" onClick={() => addOption(qi)}>Add an option</button>
              )}
            </div>
            <label className="field">
              <span>Explanation shown after submitting (optional)</span>
              <textarea rows={2} value={q.explanation} onChange={(e) => updateQuestion(qi, { explanation: e.target.value })} />
            </label>
            <div className="form-actions">
              <button type="button" className="btn btn-danger btn-sm" disabled={quiz.questions.length <= 1} onClick={() => removeQuestion(qi)}>
                Remove question
              </button>
            </div>
          </fieldset>
        ))}
        <button type="button" className="btn btn-outline" onClick={addQuestion}>Add another question</button>
      </section>

      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-actions sticky-actions">
        <Link to="/admin/quizzes" className="btn btn-ghost">Cancel</Link>
        <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : isEdit ? 'Save quiz' : 'Create quiz'}</button>
      </div>
    </form>
  );
}
