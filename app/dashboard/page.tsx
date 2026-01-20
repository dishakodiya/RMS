'use client';

import { getResources, getBookings, getMaintenance } from '@/lib/data';
import StatCard from '@/components/StatCard';

export default function DashboardPage() {
  const resources = getResources();
  const bookings = getBookings();
  const maintenance = getMaintenance();

  const totalResources = resources.length;
  const totalBookings = bookings.length;
  const pendingApprovals = bookings.filter(b => b.status === 'Pending').length;
  const upcomingBookings = bookings.filter(b => {
    const startDate = new Date(b.startDateTime);
    const today = new Date();
    return startDate >= today && b.status === 'Approved';
  }).length;
  const maintenanceAlerts = maintenance.filter(m => m.status === 'Scheduled' || m.status === 'In Progress').length;

  // Dummy monthly usage data
  const monthlyUsage = [
    { month: 'Jan', bookings: 45 },
    { month: 'Feb', bookings: 52 },
    { month: 'Mar', bookings: 48 },
    { month: 'Apr', bookings: 61 },
    { month: 'May', bookings: 55 },
    { month: 'Jun', bookings: 58 },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>
          <i className="bi bi-speedometer2 me-2 text-primary"></i>
          Dashboard
        </h1>
        <p className="text-muted mb-0">Welcome to your resource management dashboard</p>
      </div>

      <div className="row g-4 mb-4 row-cols-1 row-cols-md-2 row-cols-xl-5">
        <div className="col">
          <StatCard
            title="Total Resources"
            value={totalResources}
            icon="bi-box-seam"
            color="primary"
          />
        </div>
        <div className="col">
          <StatCard
            title="Total Bookings"
            value={totalBookings}
            icon="bi-calendar-check"
            color="info"
          />
        </div>
        <div className="col">
          <StatCard
            title="Pending Approvals"
            value={pendingApprovals}
            icon="bi-clock-history"
            color="warning"
          />
        </div>
        <div className="col">
          <StatCard
            title="Upcoming Bookings"
            value={upcomingBookings}
            icon="bi-calendar-event"
            color="success"
          />
        </div>
        <div className="col">
          <StatCard
            title="Maintenance Alerts"
            value={maintenanceAlerts}
            icon="bi-exclamation-triangle"
            color="danger"
          />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-bar-chart me-2 text-primary"></i>
                Monthly Usage Chart
              </h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-end" style={{ height: '250px', paddingTop: '1rem' }}>
                {monthlyUsage.map((item, index) => (
                  <div key={index} className="d-flex flex-column align-items-center" style={{ flex: 1, margin: '0 4px' }}>
                    <div
                      className="rounded-top"
                      style={{
                        width: '100%',
                        height: `${(item.bookings / 70) * 200}px`,
                        minHeight: '20px',
                        background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      title={`${item.month}: ${item.bookings} bookings`}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scaleY(1.05)';
                        e.currentTarget.style.opacity = '0.9';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scaleY(1)';
                        e.currentTarget.style.opacity = '1';
                      }}
                    ></div>
                    <small className="mt-2 text-muted fw-semibold">{item.month}</small>
                    <small className="text-muted">{item.bookings}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-list-ul me-2 text-primary"></i>
                Recent Bookings
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {bookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="list-group-item px-3 py-3 border-bottom" style={{ borderColor: '#e9ecef' }}>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1 fw-semibold" style={{ fontSize: '0.9rem' }}>Booking #{booking.id}</h6>
                        <small className="text-muted">
                          {new Date(booking.startDateTime).toLocaleDateString()}
                        </small>
                      </div>
                      <span className={`badge ${
                        booking.status === 'Approved' ? 'bg-success' :
                        booking.status === 'Pending' ? 'bg-warning' : 'bg-danger'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
