import { Link } from 'react-router-dom';
import DifficultyTag from './DifficultyTag';

// Questions are drawn as index cards: red margin line, blue header rule,
// and a highlighter stroke across the title once practiced.
export default function QuestionCard({ question, practiced, bookmarked, onTogglePractice, onToggleBookmark }) {
  return (
    <article className={`index-card${practiced ? ' is-practiced' : ''}`}>
      <div className="index-card-meta">
        <span>{question.category}</span>
        <DifficultyTag level={question.difficulty} />
        {question.company && <span className="muted">{question.company}</span>}
      </div>
      <h3 className="index-card-title">
        <Link to={`/questions/${question._id}`}>
          <span className="hl">{question.title}</span>
        </Link>
      </h3>
      {question.tags?.length > 0 && (
        <ul className="tag-list" aria-label="Tags">
          {question.tags.map((t) => (
            <li key={t}>#{t}</li>
          ))}
        </ul>
      )}
      <div className="index-card-actions">
        <button className={`chip${practiced ? ' chip-on' : ''}`} aria-pressed={practiced} onClick={onTogglePractice}>
          {practiced ? 'Practiced' : 'Mark practiced'}
        </button>
        <button className={`chip${bookmarked ? ' chip-on' : ''}`} aria-pressed={bookmarked} onClick={onToggleBookmark}>
          {bookmarked ? 'Bookmarked' : 'Bookmark'}
        </button>
      </div>
    </article>
  );
}
