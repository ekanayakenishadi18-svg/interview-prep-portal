import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Questions from './pages/Questions';
import QuestionDetail from './pages/QuestionDetail';
import Bookmarks from './pages/Bookmarks';
import Quizzes from './pages/Quizzes';
import TakeQuiz from './pages/TakeQuiz';
import QuizResult from './pages/QuizResult';
import History from './pages/History';
import Experiences from './pages/Experiences';
import ExperienceDetail from './pages/ExperienceDetail';
import ExperienceForm from './pages/ExperienceForm';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageQuestions from './pages/admin/ManageQuestions';
import ManageQuizzes from './pages/admin/ManageQuizzes';
import QuizEditor from './pages/admin/QuizEditor';
import ManageUsers from './pages/admin/ManageUsers';

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="page" id="main">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/questions/:id" element={<QuestionDetail />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/quizzes/:id" element={<TakeQuiz />} />
            <Route path="/results/:attemptId" element={<QuizResult />} />
            <Route path="/history" element={<History />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/experiences/new" element={<ExperienceForm />} />
            <Route path="/experiences/:id" element={<ExperienceDetail />} />
            <Route path="/experiences/:id/edit" element={<ExperienceForm />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/questions" element={<ManageQuestions />} />
            <Route path="/admin/quizzes" element={<ManageQuizzes />} />
            <Route path="/admin/quizzes/new" element={<QuizEditor />} />
            <Route path="/admin/quizzes/:id/edit" element={<QuizEditor />} />
            <Route path="/admin/users" element={<ManageUsers />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
