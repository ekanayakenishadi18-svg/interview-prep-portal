import toast from 'react-hot-toast';
import api, { getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';

// Bookmark / practiced toggles shared by every page that lists questions
export default function useQuestionActions() {
  const { user, setUser } = useAuth();

  const isBookmarked = (id) => Boolean(user?.bookmarks?.includes(id));
  const isPracticed = (id) => Boolean(user?.practiced?.includes(id));

  const toggle = async (id, field) => {
    const endpoint = field === 'bookmarks' ? 'bookmark' : 'practice';
    try {
      const { data } = await api.post(`/questions/${id}/${endpoint}`);
      setUser((u) => ({ ...u, [field]: data[field] }));
      const messages = {
        bookmarks: data.active ? 'Bookmarked' : 'Bookmark removed',
        practiced: data.active ? 'Marked as practiced' : 'Marked as not practiced',
      };
      toast.success(messages[field]);
      return data.active;
    } catch (err) {
      toast.error(getErrorMessage(err));
      return null;
    }
  };

  return {
    isBookmarked,
    isPracticed,
    toggleBookmark: (id) => toggle(id, 'bookmarks'),
    togglePractice: (id) => toggle(id, 'practiced'),
  };
}
