export default function ScoreBadge({ percentage }) {
  const band = percentage >= 70 ? 'high' : percentage >= 40 ? 'mid' : 'low';
  return <span className={`score score-${band}`}>{percentage}%</span>;
}
