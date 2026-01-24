interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color?: 'primary' | 'success' | 'warning' | 'info' | 'danger';
}

export default function StatCard({ title, value, icon, color = 'primary' }: StatCardProps) {
  return (
    // <div className={`stat-card ${color} h-100`}>
      <div className={`stat-card h-100 text-${color}`}>
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <div className="stat-card-label">{title}</div>
          <div className="stat-card-value">{value}</div>
        </div>
        <div className="stat-card-icon">
          <i className={`bi ${icon}`}></i>
        </div>
      </div>
    </div>
  );
}
