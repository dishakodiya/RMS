'use client';

import { getBookings, getResources, getResourceTypes, getMaintenance } from '@/lib/data';

export default function ReportsPage() {
  const bookings = getBookings();
  const resources = getResources();
  const resourceTypes = getResourceTypes();
  const maintenance = getMaintenance();

  // Resource-wise bookings
  const resourceBookings = resources.map(resource => {
    const resourceBookingList = bookings.filter(b => b.resourceId === resource.id);
    return {
      resource: resource.name,
      totalBookings: resourceBookingList.length,
      approved: resourceBookingList.filter(b => b.status === 'Approved').length,
      pending: resourceBookingList.filter(b => b.status === 'Pending').length,
      rejected: resourceBookingList.filter(b => b.status === 'Rejected').length,
    };
  });

  // Resource type usage
  const resourceTypeUsage = resourceTypes.map(type => {
    const typeResources = resources.filter(r => r.resourceTypeId === type.id);
    const typeBookings = bookings.filter(b => 
      typeResources.some(r => r.id === b.resourceId)
    );
    return {
      type: type.name,
      totalResources: typeResources.length,
      totalBookings: typeBookings.length,
    };
  });

  // Monthly summary (dummy data)
  const monthlySummary = [
    { month: 'January', bookings: 45, maintenance: 8 },
    { month: 'February', bookings: 52, maintenance: 6 },
    { month: 'March', bookings: 48, maintenance: 10 },
    { month: 'April', bookings: 61, maintenance: 7 },
    { month: 'May', bookings: 55, maintenance: 9 },
    { month: 'June', bookings: 58, maintenance: 8 },
  ];

  // Yearly summary (dummy data)
  const yearlySummary = {
    totalBookings: 319,
    totalMaintenance: 48,
    totalResources: resources.length,
    averageBookingsPerMonth: 53,
  };

  const handleDownload = () => {
    alert('Download functionality would be implemented here. This is a frontend-only demo.');
  };

  return (
    <div>
      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h1>
            <i className="bi bi-file-earmark-text me-2 text-primary"></i>
            Reports
          </h1>
          <p className="text-muted mb-0">View comprehensive reports and analytics</p>
        </div>
        <button className="btn btn-primary" onClick={handleDownload}>
          <i className="bi bi-download me-2"></i>
          Download Report
        </button>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-primary mb-2">{yearlySummary.totalBookings}</h3>
              <p className="text-muted mb-0 small">Total Bookings</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-success mb-2">{yearlySummary.totalMaintenance}</h3>
              <p className="text-muted mb-0 small">Total Maintenance</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-info mb-2">{yearlySummary.totalResources}</h3>
              <p className="text-muted mb-0 small">Total Resources</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="text-warning mb-2">{yearlySummary.averageBookingsPerMonth}</h3>
              <p className="text-muted mb-0 small">Avg Bookings/Month</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-bar-chart me-2 text-primary"></i>
                Resource-wise Bookings
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-sm mb-0">
                  <thead>
                    <tr>
                      <th>Resource</th>
                      <th>Total</th>
                      <th>Approved</th>
                      <th>Pending</th>
                      <th>Rejected</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resourceBookings.map((item, index) => (
                      <tr key={index}>
                        <td className="fw-semibold">{item.resource}</td>
                        <td>{item.totalBookings}</td>
                        <td><span className="badge bg-success">{item.approved}</span></td>
                        <td><span className="badge bg-warning">{item.pending}</span></td>
                        <td><span className="badge bg-danger">{item.rejected}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-pie-chart me-2 text-primary"></i>
                Resource Type Usage
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-sm mb-0">
                  <thead>
                    <tr>
                      <th>Resource Type</th>
                      <th>Total Resources</th>
                      <th>Total Bookings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resourceTypeUsage.map((item, index) => (
                      <tr key={index}>
                        <td className="fw-semibold">{item.type}</td>
                        <td>{item.totalResources}</td>
                        <td>{item.totalBookings}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-0">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-calendar3 me-2 text-primary"></i>
                Monthly Summary
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-sm mb-0">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Bookings</th>
                      <th>Maintenance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlySummary.map((item, index) => (
                      <tr key={index}>
                        <td className="fw-semibold">{item.month}</td>
                        <td>{item.bookings}</td>
                        <td>{item.maintenance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-wrench me-2 text-primary"></i>
                Maintenance History
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-sm mb-0">
                  <thead>
                    <tr>
                      <th>Resource</th>
                      <th>Type</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {maintenance.map((maint) => {
                      const resource = resources.find(r => r.id === maint.resourceId);
                      return (
                        <tr key={maint.id}>
                          <td className="fw-semibold">{resource?.name || 'N/A'}</td>
                          <td>{maint.maintenanceType}</td>
                          <td>{new Date(maint.scheduledDate).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge ${
                              maint.status === 'Completed' ? 'bg-success' :
                              maint.status === 'In Progress' ? 'bg-primary' : 'bg-info'
                            }`}>
                              {maint.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
