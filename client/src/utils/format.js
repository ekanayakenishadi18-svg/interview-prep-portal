export const formatDate = (value) =>
  new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

// 125 -> "2:05"
export const formatDuration = (seconds = 0) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
};

export const firstName = (name = '') => name.trim().split(' ')[0];

export const excerpt = (text = '', length = 220) =>
  text.length > length ? `${text.slice(0, length).trimEnd()}…` : text;
