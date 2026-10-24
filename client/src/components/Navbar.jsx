import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { firstName } from '../utils/format';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  const links = user
    ? [
        ['/dashboard', 'Dashboard'],
        ['/questions', 'Questions'],
        ['/quizzes', 'Quizzes'],
        ['/experiences', 'Experiences'],
        ['/bookmarks', 'Bookmarks'],
        ...(isAdmin ? [['/admin', 'Admin']] : []),
      ]
    : [];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="nav">
      <a href="#main" className="skip-link">Skip to content</a>
      <div className="nav-inner">
        <Link to={user ? '/dashboard' : '/'} className="brand">
          <span className="brand-mark" aria-hidden="true" />
          Interview Prep Portal
        </Link>

        <button
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Close' : 'Menu'}
        </button>

        <nav id="nav-menu" className={`nav-menu${open ? ' is-open' : ''}`} aria-label="Main">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} className="nav-link">
              {label}
            </NavLink>
          ))}
          <div className="nav-user">
            {user ? (
              <>
                <NavLink to="/profile" className="nav-link">
                  {firstName(user.name)}
                </NavLink>
                <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="nav-link">Log in</NavLink>
                <Link to="/register" className="btn btn-primary btn-sm">Create account</Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
