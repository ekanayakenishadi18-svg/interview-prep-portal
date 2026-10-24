import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '../api/client';
import Loader from '../components/Loader';
import { DIFFICULTIES, OUTCOMES } from '../utils/constants';

const EMPTY = {
  company: '',
  role: '',
  location: '',
  outcome: 'Awaiting result',
  difficulty: 'Medium',
  rounds: 1,
  content: '',
  tips: '',
};

export default function ExperienceForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    api
      .get(`/experiences/${id}`)
      .then(({ data }) => {
        const { company, role, location, outcome, difficulty, rounds, content, tips } = data.experience;
        setForm({ company, role, location, outcome, difficulty, rounds, content, tips });
      })
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.content.trim().length < 50) return setError('Write at least 50 characters about the interview.');
    setError('');
    setSaving(true);
    try {
      const payload = { ...form, rounds: Number(form.rounds) };
      const { data } = isEdit ? await api.put(`/experiences/${id}`, payload) : await api.post('/experiences', payload);
      toast.success(isEdit ? 'Post updated' : 'Experience shared');
      navigate(`/experiences/${data.experience._id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="detail">
      <Link to={isEdit ? `/experiences/${id}` : '/experiences'} className="back-link">Cancel</Link>
      <form className="panel form-grid" onSubmit={onSubmit}>
        <h1 className="span-2">{isEdit ? 'Edit your experience' : 'Share an interview experience'}</h1>
        {error && <p className="form-error span-2" role="alert">{error}</p>}
        <label className="field">
          <span>Company</span>
          <input name="company" value={form.company} onChange={onChange} required maxLength={80} />
        </label>
        <label className="field">
          <span>Role</span>
          <input name="role" value={form.role} onChange={onChange} required maxLength={80} placeholder="e.g. Software Engineer Intern" />
        </label>
        <label className="field">
          <span>Location (optional)</span>
          <input name="location" value={form.location} onChange={onChange} maxLength={80} placeholder="City or Remote" />
        </label>
        <label className="field">
          <span>Number of rounds</span>
          <input type="number" name="rounds" min={1} max={10} value={form.rounds} onChange={onChange} />
        </label>
        <label className="field">
          <span>Outcome</span>
          <select name="outcome" value={form.outcome} onChange={onChange}>
            {OUTCOMES.map((o) => <option key={o}>{o}</option>)}
          </select>
        </label>
        <label className="field">
          <span>How hard was it?</span>
          <select name="difficulty" value={form.difficulty} onChange={onChange}>
            {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
          </select>
        </label>
        <label className="field span-2">
          <span>What happened in each round?</span>
          <textarea
            name="content"
            rows={10}
            value={form.content}
            onChange={onChange}
            maxLength={5000}
            placeholder="Describe the rounds, the questions you were asked, and how you approached them."
            required
          />
          <small className="muted">{form.content.length}/5000 characters, minimum 50</small>
        </label>
        <label className="field span-2">
          <span>Tips for other candidates (optional)</span>
          <textarea name="tips" rows={3} value={form.tips} onChange={onChange} maxLength={1000} />
        </label>
        <div className="form-actions span-2">
          <button className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Share experience'}
          </button>
        </div>
      </form>
    </div>
  );
}
