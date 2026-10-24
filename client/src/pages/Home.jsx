import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DifficultyTag from '../components/DifficultyTag';

const SAMPLE = {
  category: 'Operating Systems',
  difficulty: 'Easy',
  title: 'What is the difference between a process and a thread?',
  answer:
    'A process is a program in execution with its own memory space. A thread runs inside a process and shares that memory with the other threads, so threads are cheaper to create and switch between, but they need locks to avoid stepping on each other.',
};

export default function Home() {
  const { user } = useAuth();
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-copy">
          <h1>Practice the questions before the interview asks them.</h1>
          <p className="lead">
            A question bank with model answers, timed quizzes that grade themselves, and interview stories shared by
            other candidates.
          </p>
          <div className="hero-actions">
            {user ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">Go to your dashboard</Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">Create a free account</Link>
                <Link to="/login" className="btn btn-ghost btn-lg">Log in</Link>
              </>
            )}
          </div>
        </div>

        <div className="hero-demo">
          <article className="index-card index-card-lg hero-card">
            <div className="index-card-meta">
              <span>{SAMPLE.category}</span>
              <DifficultyTag level={SAMPLE.difficulty} />
            </div>
            <h2 className="index-card-title">{SAMPLE.title}</h2>
            {revealed ? (
              <p className="answer-text reveal">{SAMPLE.answer}</p>
            ) : (
              <p className="muted hint">Say your answer out loud first. Then check it.</p>
            )}
            <button className="btn btn-outline" aria-expanded={revealed} onClick={() => setRevealed((r) => !r)}>
              {revealed ? 'Hide answer' : 'Show answer'}
            </button>
          </article>
        </div>
      </section>

      <section className="features" aria-label="What you can do">
        <div>
          <h3>Question bank</h3>
          <p>
            Data structures, databases, operating systems, networks, web development, system design and HR rounds.
            Filter by topic and difficulty, and keep track of what you've practiced.
          </p>
        </div>
        <div>
          <h3>Timed quizzes</h3>
          <p>
            Multiple-choice quizzes against the clock. You see your score straight away, with the right answer and an
            explanation for every question.
          </p>
        </div>
        <div>
          <h3>Interview experiences</h3>
          <p>
            Read how other people's interviews went, round by round, and share your own so the next candidate is
            better prepared.
          </p>
        </div>
      </section>
    </div>
  );
}
