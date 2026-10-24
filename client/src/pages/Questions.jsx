import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '../api/client';
import useDebounce from '../hooks/useDebounce';
import useQuestionActions from '../hooks/useQuestionActions';
import QuestionCard from '../components/QuestionCard';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { CATEGORIES, DIFFICULTIES } from '../utils/constants';

const STATUS_OPTIONS = [
  ['', 'All questions'],
  ['pending', 'Not practiced yet'],
  ['practiced', 'Practiced'],
  ['bookmarked', 'Bookmarked'],
];

export default function Questions() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get('search') || '');
  const debouncedSearch = useDebounce(search);
  const [data, setData] = useState({ questions: [], page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const actions = useQuestionActions();

  const category = params.get('category') || '';
  const difficulty = params.get('difficulty') || '';
  const status = params.get('status') || '';
  const page = Number(params.get('page')) || 1;
  const query = params.toString();

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.delete('page');
    setParams(next);
  };

  // Push the debounced search box into the URL
  useEffect(() => {
    if ((params.get('search') || '') !== debouncedSearch) setParam('search', debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  useEffect(() => {
    let ignore = false; // drop responses from outdated requests
    setLoading(true);
    api
      .get(`/questions?${query}`)
      .then((r) => !ignore && setData(r.data))
      .catch((e) => !ignore && toast.error(getErrorMessage(e)))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, [query]);

  const hasFilters = category || difficulty || status || search;

  return (
    <div className="stack-lg">
      <header className="page-head">
        <div>
          <h1>Question bank</h1>
          <p className="muted">Try answering each one before you open the model answer.</p>
        </div>
      </header>

      <div className="filters" role="search">
        <label className="field grow">
          <span>Search</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Keyword, tag or company"
          />
        </label>
        <label className="field">
          <span>Topic</span>
          <select value={category} onChange={(e) => setParam('category', e.target.value)}>
            <option value="">All topics</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Difficulty</span>
          <select value={difficulty} onChange={(e) => setParam('difficulty', e.target.value)}>
            <option value="">Any</option>
            {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Show</span>
          <select value={status} onChange={(e) => setParam('status', e.target.value)}>
            {STATUS_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
        {hasFilters && (
          <button
            className="btn btn-ghost btn-sm filters-clear"
            onClick={() => {
              setSearch('');
              setParams({});
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {loading ? (
        <Loader />
      ) : data.questions.length === 0 ? (
        <EmptyState title="No questions match these filters">Try another topic or clear the filters.</EmptyState>
      ) : (
        <>
          <p className="muted small">{data.total} {data.total === 1 ? 'question' : 'questions'}</p>
          <div className="card-list">
            {data.questions.map((q) => (
              <QuestionCard
                key={q._id}
                question={q}
                practiced={actions.isPracticed(q._id)}
                bookmarked={actions.isBookmarked(q._id)}
                onTogglePractice={() => actions.togglePractice(q._id)}
                onToggleBookmark={() => actions.toggleBookmark(q._id)}
              />
            ))}
          </div>
          <Pagination page={data.page} pages={data.pages} onChange={(p) => setParam('page', String(p))} />
        </>
      )}
    </div>
  );
}
