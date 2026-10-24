import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '../../api/client';
import DifficultyTag from '../../components/DifficultyTag';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';

export default function ManageQuizzes() {
  const [quizzes, setQuizzes] = useState(null);

  const load = () =>
    api.get('/quizzes/admin/all').then((r) => setQuizzes(r.data.quizzes)).catch((e) => toast.error(getErrorMessage(e)));

  useEffect(() => {
    load();
  }, []);

  const togglePublish = async (quiz) => {
    try {
      await api.put(`/quizzes/${quiz._id}`, { isPublished: !quiz.isPublished });
      toast.success(quiz.isPublished ? 'Quiz unpublished' : 'Quiz published');
      load();
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  const remove = async (quiz) => {
    if (!window.confirm(`Delete "${quiz.title}"? Past results stay in users' history.`)) return;
    try {
      await api.delete(`/quizzes/${quiz._id}`);
      toast.success('Quiz deleted');
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
          <h1>Manage quizzes</h1>
        </div>
        <Link to="/admin/quizzes/new" className="btn btn-primary">Create quiz</Link>
      </header>

      {!quizzes ? (
        <Loader />
      ) : quizzes.length === 0 ? (
        <EmptyState title="No quizzes yet" action={<Link to="/admin/quizzes/new" className="btn btn-outline btn-sm">Create quiz</Link>}>
          Create the first quiz for students to take.
        </EmptyState>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Quiz</th>
                <th scope="col">Topic</th>
                <th scope="col">Difficulty</th>
                <th scope="col">Questions</th>
                <th scope="col">Attempts</th>
                <th scope="col">Status</th>
                <th scope="col"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((q) => (
                <tr key={q._id}>
                  <td className="cell-wide">{q.title}</td>
                  <td className="muted">{q.category}</td>
                  <td><DifficultyTag level={q.difficulty} /></td>
                  <td>{q.questionCount}</td>
                  <td>{q.attemptCount}</td>
                  <td>{q.isPublished ? 'Published' : 'Draft'}</td>
                  <td className="cell-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => togglePublish(q)}>
                      {q.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    <Link to={`/admin/quizzes/${q._id}/edit`} className="btn btn-ghost btn-sm">Edit</Link>
                    <button className="btn btn-danger btn-sm" onClick={() => remove(q)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
