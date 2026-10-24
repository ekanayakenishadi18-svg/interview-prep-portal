import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '../api/client';
import useDebounce from '../hooks/useDebounce';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import DifficultyTag from '../components/DifficultyTag';
import { OUTCOMES } from '../utils/constants';
import { excerpt, formatDate } from '../utils/format';

export const OutcomeTag = ({ outcome }) => (
  <span className={`tag outcome-${outcome.split(' ')[0].toLowerCase()}`}>{outcome}</span>
);

export default function Experiences() {
  const [search, setSearch] = useState('');
  const [outcome, setOutcome] = useState('');
  const [sort, setSort] = useState('newest');
  const [mine, setMine] = useState(false);
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const debouncedSearch = useDebounce(search);

  useEffect(() => setPage(1), [debouncedSearch, outcome, sort, mine]);

  useEffect(() => {
    let ignore = false; // drop responses from outdated requests
    setData(null);
    api
      .get('/experiences', {
        params: { search: debouncedSearch || undefined, outcome: outcome || undefined, sort, mine: mine || undefined, page },
      })
      .then((r) => !ignore && setData(r.data))
      .catch((e) => {
        if (ignore) return;
        toast.error(getErrorMessage(e));
        setData({ experiences: [], page: 1, pages: 1, total: 0 });
      });
    return () => {
      ignore = true;
    };
  }, [debouncedSearch, outcome, sort, mine, page]);

  return (
    <div className="stack-lg">
      <header className="page-head">
        <div>
          <h1>Interview experiences</h1>
          <p className="muted">What the rounds looked like, what was asked, and how it turned out.</p>
        </div>
        <Link to="/experiences/new" className="btn btn-primary">Share your experience</Link>
      </header>

      <div className="filters" role="search">
        <label className="field grow">
          <span>Search</span>
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Company, role or keyword" />
        </label>
        <label className="field">
          <span>Outcome</span>
          <select value={outcome} onChange={(e) => setOutcome(e.target.value)}>
            <option value="">Any</option>
            {OUTCOMES.map((o) => <option key={o}>{o}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Sort by</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="popular">Most helpful</option>
            <option value="oldest">Oldest</option>
          </select>
        </label>
        <label className="check">
          <input type="checkbox" checked={mine} onChange={(e) => setMine(e.target.checked)} />
          Only my posts
        </label>
      </div>

      {!data ? (
        <Loader />
      ) : data.experiences.length === 0 ? (
        <EmptyState
          title={mine ? "You haven't shared anything yet" : 'No experiences match'}
          action={<Link to="/experiences/new" className="btn btn-outline btn-sm">Share your experience</Link>}
        >
          Your interview story could help the next person prepare.
        </EmptyState>
      ) : (
        <>
          <div className="card-list">
            {data.experiences.map((x) => (
              <article key={x._id} className="experience-item">
                <div className="index-card-meta">
                  <OutcomeTag outcome={x.outcome} />
                  <DifficultyTag level={x.difficulty} />
                  <span className="muted">{x.rounds} {x.rounds === 1 ? 'round' : 'rounds'}</span>
                  {x.location && <span className="muted">{x.location}</span>}
                </div>
                <h2 className="experience-title">
                  <Link to={`/experiences/${x._id}`}>{x.company}, {x.role}</Link>
                </h2>
                <p className="reading">{excerpt(x.content)}</p>
                <p className="small muted">
                  {x.author?.name || 'Deleted user'}, {formatDate(x.createdAt)}. {x.likeCount} found this helpful.
                </p>
              </article>
            ))}
          </div>
          <Pagination page={data.page} pages={data.pages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
