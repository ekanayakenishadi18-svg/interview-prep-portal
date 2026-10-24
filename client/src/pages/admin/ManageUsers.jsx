import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import useDebounce from '../../hooks/useDebounce';
import Pagination from '../../components/Pagination';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { formatDate } from '../../utils/format';

export default function ManageUsers() {
  const { user: me } = useAuth();
  const [data, setData] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);

  const load = useCallback(() => {
    api
      .get('/users', { params: { search: debouncedSearch || undefined, page } })
      .then((r) => setData(r.data))
      .catch((e) => toast.error(getErrorMessage(e)));
  }, [debouncedSearch, page]);

  useEffect(() => setPage(1), [debouncedSearch]);
  useEffect(() => load(), [load]);

  const changeRole = async (u, role) => {
    try {
      await api.put(`/users/${u._id}/role`, { role });
      toast.success(`${u.name} is now ${role === 'admin' ? 'an admin' : 'a regular user'}`);
      load();
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  const remove = async (u) => {
    if (!window.confirm(`Delete ${u.name}'s account? Their quiz results and posts will be deleted too.`)) return;
    try {
      await api.delete(`/users/${u._id}`);
      toast.success('Account deleted');
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
          <h1>Manage users</h1>
        </div>
      </header>

      <div className="filters">
        <label className="field grow">
          <span>Search by name or email</span>
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
      </div>

      {!data ? (
        <Loader />
      ) : data.users.length === 0 ? (
        <EmptyState title="No users found">Try a different name or email.</EmptyState>
      ) : (
        <>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Role</th>
                  <th scope="col">Practiced</th>
                  <th scope="col">Joined</th>
                  <th scope="col"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((u) => {
                  const isMe = u._id === me._id;
                  return (
                    <tr key={u._id}>
                      <td>{u.name}{isMe && <span className="muted small"> (you)</span>}</td>
                      <td className="muted">{u.email}</td>
                      <td>
                        <select
                          value={u.role}
                          disabled={isMe}
                          onChange={(e) => changeRole(u, e.target.value)}
                          aria-label={`Role for ${u.name}`}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>{u.practicedCount}</td>
                      <td>{formatDate(u.createdAt)}</td>
                      <td className="cell-actions">
                        <button className="btn btn-danger btn-sm" disabled={isMe} onClick={() => remove(u)}>Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination page={data.page} pages={data.pages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
