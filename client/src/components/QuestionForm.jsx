import { useState } from 'react';
import { CATEGORIES, DIFFICULTIES } from '../utils/constants';

const EMPTY = { title: '', answer: '', category: CATEGORIES[0], difficulty: 'Medium', tags: '', company: '' };

// Used by admins to add or edit a question
export default function QuestionForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(() =>
    initial ? { ...EMPTY, ...initial, tags: (initial.tags || []).join(', ') } : EMPTY
  );
  const [error, setError] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.answer.trim()) {
      setError('Add both the question and a model answer.');
      return;
    }
    setError('');
    onSave({ ...form, tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean) });
  };

  return (
    <form className="panel form-grid" onSubmit={onSubmit}>
      <h2 className="span-2">{initial ? 'Edit question' : 'Add a question'}</h2>
      {error && <p className="form-error span-2" role="alert">{error}</p>}
      <label className="field span-2">
        <span>Question</span>
        <textarea name="title" rows={2} value={form.title} onChange={onChange} required />
      </label>
      <label className="field span-2">
        <span>Model answer</span>
        <textarea name="answer" rows={8} value={form.answer} onChange={onChange} required />
      </label>
      <label className="field">
        <span>Category</span>
        <select name="category" value={form.category} onChange={onChange}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </label>
      <label className="field">
        <span>Difficulty</span>
        <select name="difficulty" value={form.difficulty} onChange={onChange}>
          {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
        </select>
      </label>
      <label className="field">
        <span>Tags (comma separated)</span>
        <input name="tags" value={form.tags} onChange={onChange} placeholder="sql, joins" />
      </label>
      <label className="field">
        <span>Company or source (optional)</span>
        <input name="company" value={form.company} onChange={onChange} />
      </label>
      <div className="form-actions span-2">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving…' : initial ? 'Save changes' : 'Add question'}
        </button>
      </div>
    </form>
  );
}
