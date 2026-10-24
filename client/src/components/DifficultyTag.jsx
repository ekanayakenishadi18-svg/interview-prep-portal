export default function DifficultyTag({ level }) {
  if (!level) return null;
  return <span className={`tag tag-${level.toLowerCase()}`}>{level}</span>;
}
