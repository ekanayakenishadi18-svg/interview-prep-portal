import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import DifficultyTag from '../components/DifficultyTag';
import { OutcomeTag } from './Experiences';
import { formatDate } from '../utils/format';

export default function ExperienceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [experience, setExperience] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/experiences/${id}`).then((r) => setExperience(r.data.experience)).catch((e) => setError(getErrorMessage(e)));
  }, [id]);

  if (error) {
    return (
      <EmptyState title="Couldn't open this post" action={<Link to="/experiences" className="btn btn-outline btn-sm">Back to experiences</Link>}>
        {error}
      </EmptyState>
    );
  }
  if (!experience) return <Loader />;

  const isOwner = experience.author?._id === user._id;
  const liked = experience.likes.includes(user._id);

  const toggleLike = async () => {
    try {
      const { data } = await api.post(`/experiences/${id}/like`);
      setExperience((x) => ({
        ...x,
        likeCount: data.likeCount,
        likes: data.liked ? [...x.likes, user._id] : x.likes.filter((l) => l !== user._id),
      }));
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  const remove = async () => {
    if (!window.confirm('Delete this post? This can’t be undone.')) return;
    try {
      await api.delete(`/experiences/${id}`);
      toast.success('Post deleted');
      navigate('/experiences');
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  return (
    <div className="detail">
      <Link to="/experiences" className="back-link">Back to experiences</Link>
      <article className="panel stack">
        <div className="index-card-meta">
          <OutcomeTag outcome={experience.outcome} />
          <DifficultyTag level={experience.difficulty} />
          <span className="muted">{experience.rounds} {experience.rounds === 1 ? 'round' : 'rounds'}</span>
          {experience.location && <span className="muted">{experience.location}</span>}
        </div>
        <h1>{experience.company}, {experience.role}</h1>
        <p className="small muted">
          Shared by {experience.author?.name || 'a deleted user'}
          {experience.author?.targetRole ? ` (${experience.author.targetRole})` : ''} on {formatDate(experience.createdAt)}
        </p>

        <div className="reading prose">{experience.content}</div>

        {experience.tips && (
          <aside className="tips">
            <h2>Tips from the candidate</h2>
            <p className="reading">{experience.tips}</p>
          </aside>
        )}

        <div className="form-actions start">
          <button className={`chip${liked ? ' chip-on' : ''}`} aria-pressed={liked} onClick={toggleLike}>
            {liked ? 'Marked helpful' : 'This was helpful'} ({experience.likeCount})
          </button>
          {isOwner && <Link to={`/experiences/${id}/edit`} className="btn btn-ghost btn-sm">Edit post</Link>}
          {(isOwner || isAdmin) && <button className="btn btn-danger btn-sm" onClick={remove}>Delete post</button>}
        </div>
      </article>
    </div>
  );
}
