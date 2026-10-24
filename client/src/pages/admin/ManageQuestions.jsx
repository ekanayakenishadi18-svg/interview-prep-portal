import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '../../api/client';
import useDebounce from '../../hooks/useDebounce';
import QuestionForm from '../../components/QuestionForm';
import DifficultyTag from '../../components/DifficultyTag';
import Pagination from '../../components/Pagination';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { CATEGORIES } from '../../utils/constants';

export default function ManageQuestions() {
  const [data, setData] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, question = edit
  const [saving, setSaving] = useState(false);
  const debouncedSearch = useDebounce(search);

  const load = useCallback(() => {
    api
      .get('/questions', { params: { search: debouncedSearch || undefined, category: category || undefined, page, limit: 15 } })
      .then((r) => setData(r.data))
      .catch((e) => toast.error(getErrorMessage(e)));
  }, [debouncedSearch, category, page]);

  useEffect(() => setPage(1), [debouncedSearch, category]);
  useEffect(() => load(), [load]);

  const openEditor = async (id) => {
    try {
      const { data: res } = await api.get(`/questions/${id}`);
      setEditing(res.question);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  const save = async (payload) => {
    setSaving(true);
    try {
      if (editing._id) await api.put(`/questions/${editing._id}`, payload);
      else await api.post('/questions', payload);
      toast.success(editing._id ? 'Question updated' : 'Question added');
      setEditing(null);
      load();
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (q) => {
    if (!window.confirm(`Delete "${q.title}"? It will also be removed from everyone's bookmarks.`)) return;
    try {
      await api.delete(`/questions/${q._id}`);
      toast.success('Question deleted');
      load();
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  return (
    <div className="stack-lg">
      <header className="page-head">
        <div>
          <Link to="/admin" className="back-link">Admin</Link>
          <h1>Manage questions</h1>
        </div>
        {!editing && <button className="btn btn-primary" onClick={() => setEditing({})}>Add question</button>}
      </header>

      {editing && (
        <QuestionForm
          key={editing._id || 'new'}
          initial={editing._id ? editing : null}
          onSave={save}
          onCancel={() => setEditing(null)}
          saving={saving}
        />
      )}

      <div className="filters">
        <label className="field grow">
          <span>Search</span>
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
        <label className="field">
          <span>Topic</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All topics</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
      </div>

      {!data ? (
        <Loader />
      ) : data.questions.length === 0 ? (
        <EmptyState title="No questions found">Add one with the button above.</EmptyState>
      ) : (
        <>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Question</th>
                  <th scope="col">Topic</th>
                  <th scope="col">Difficulty</th>
                  <th scope="col"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {data.questions.map((q) => (
                  <tr key={q._id}>
                    <td className="cell-wide">{q.title}</td>
                    <td className="muted">{q.category}</td>
                    <td><DifficultyTag level={q.difficulty} /></td>
                    <td className="cell-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => openEditor(q._id)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => remove(q)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={data.page} pages={data.pages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
