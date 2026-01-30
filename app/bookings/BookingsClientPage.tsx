'use client';

import { useState, useMemo } from 'react';
import { getBookings, getResources, getUsers, type Booking } from '@/lib/data';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';
import Toast from '@/components/Toast';
import SearchFilter from '@/components/SearchFilter';
import { useAuth } from '@/lib/auth';

export default function BookingsClientPage( {
      initialBookings,
    }: {
      initialBookings: Booking[];
    }) {
    const [bookings, setBookings] = useState<Booking[]>(initialBookings);
//   const [bookings, setBookings] = useState<Booking[]>(getBookings());
  const resources = getResources();
  const users = getUsers();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [formData, setFormData] = useState({
    resourceId: '',
    userId: '',
    startDateTime: '',
    endDateTime: '',
  });

  const getResourceName = (id: string) => {
    return resources.find(r => r.id === id)?.name || 'N/A';
  };

  const getUserName = (id: string) => {
    return users.find(u => u.id === id)?.name || 'N/A';
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const resourceName = getResourceName(booking.resourceId).toLowerCase();
      const userName = getUserName(booking.userId).toLowerCase();
      const matchesSearch = 
        resourceName.includes(searchValue.toLowerCase()) ||
        userName.includes(searchValue.toLowerCase()) ||
        booking.id.includes(searchValue);
      const matchesFilter = !filterValue || booking.status === filterValue;
      return matchesSearch && matchesFilter;
    });
  }, [bookings, searchValue, filterValue, resources, users]);

  const handleAdd = () => {
    setEditingBooking(null);
    setFormData({
      resourceId: '',
      userId: user?.role === 'User' ? users.find(u => u.email === user.email)?.id || '' : '',
      startDateTime: '',
      endDateTime: '',
    });
    setShowModal(true);
  };

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking);
    setFormData({
      resourceId: booking.resourceId,
      userId: booking.userId,
      startDateTime: new Date(booking.startDateTime).toISOString().slice(0, 16),
      endDateTime: new Date(booking.endDateTime).toISOString().slice(0, 16),
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      setBookings(bookings.filter(b => b.id !== id));
      showNotification('Booking deleted successfully', 'success');
    }
  };

  const handleApprove = (id: string) => {
    setBookings(bookings.map(b => 
      b.id === id 
        ? { ...b, status: 'Approved' as const, approverId: users.find(u => u.email === user?.email)?.id || null }
        : b
    ));
    showNotification('Booking approved successfully', 'success');
  };

  const handleReject = (id: string) => {
    setBookings(bookings.map(b => 
      b.id === id 
        ? { ...b, status: 'Rejected' as const, approverId: users.find(u => u.email === user?.email)?.id || null }
        : b
    ));
    showNotification('Booking rejected successfully', 'success');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBooking) {
      setBookings(bookings.map(b => 
        b.id === editingBooking.id 
          ? { ...b, ...formData }
          : b
      ));
      showNotification('Booking updated successfully', 'success');
    } else {
      const newBooking: Booking = {
        id: Date.now().toString(),
        ...formData,
        status: 'Pending' as const,
        approverId: null,
        createdAt: new Date().toISOString(),
      };
      setBookings([...bookings, newBooking]);
      showNotification('Booking created successfully', 'success');
    }
    setShowModal(false);
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const getApproverName = (id: string | null) => {
    if (!id) return 'N/A';
    return users.find(u => u.id === id)?.name || 'N/A';
  };

  const canApprove = user?.role === 'Admin' || user?.role === 'Approver';

  const statusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Approved', label: 'Approved' },
    { value: 'Rejected', label: 'Rejected' },
  ];

  return (
    <div>
      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h1>
            <i className="bi bi-calendar-check me-2 text-primary"></i>
            Bookings
          </h1>
          <p className="text-muted mb-0">Manage resource bookings and approvals</p>
        </div>
        {(user?.role === 'Admin' || user?.role === 'User') && (
          <button className="btn btn-primary" onClick={handleAdd}>
            <i className="bi bi-plus-circle me-2"></i>
            Create Booking
          </button>
        )}
      </div>

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filterValue={filterValue}
        onFilterChange={setFilterValue}
        filterOptions={statusOptions}
        placeholder="Search by resource, user, or booking ID..."
      />

      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Resource</th>
                  <th>User</th>
                  <th>Start Date & Time</th>
                  <th>End Date & Time</th>
                  <th>Status</th>
                  <th>Approver</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-4">
                      <i className="bi bi-inbox me-2"></i>
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="fw-semibold">{getResourceName(booking.resourceId)}</td>
                      <td>{getUserName(booking.userId)}</td>
                      <td>{new Date(booking.startDateTime).toLocaleString()}</td>
                      <td>{new Date(booking.endDateTime).toLocaleString()}</td>
                      <td><StatusBadge status={booking.status} /></td>
                      <td>{getApproverName(booking.approverId)}</td>
                      <td className="text-end">
                        {canApprove && booking.status === 'Pending' && (
                          <>
                            <button
                              className="btn btn-sm btn-success me-2"
                              onClick={() => handleApprove(booking.id)}
                              title="Approve"
                            >
                              <i className="bi bi-check"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-danger me-2"
                              onClick={() => handleReject(booking.id)}
                              title="Reject"
                            >
                              <i className="bi bi-x"></i>
                            </button>
                          </>
                        )}
                        {user?.role === 'Admin' && (
                          <>
                            <button
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() => handleEdit(booking)}
                              title="Edit"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(booking.id)}
                              title="Delete"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        id="bookingModal"
        title={editingBooking ? 'Edit Booking' : 'Create Booking'}
        show={showModal}
        onClose={() => setShowModal(false)}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Resource</label>
              <select
                className="form-select"
                value={formData.resourceId}
                onChange={(e) => setFormData({ ...formData, resourceId: e.target.value })}
                required
              >
                <option value="">Select Resource</option>
                {resources.map(resource => (
                  <option key={resource.id} value={resource.id}>{resource.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">User</label>
              <select
                className="form-select"
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                required
                disabled={user?.role === 'User'}
              >
                <option value="">Select User</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Start Date & Time</label>
              <input
                type="datetime-local"
                className="form-control"
                value={formData.startDateTime}
                onChange={(e) => setFormData({ ...formData, startDateTime: e.target.value })}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">End Date & Time</label>
              <input
                type="datetime-local"
                className="form-control"
                value={formData.endDateTime}
                onChange={(e) => setFormData({ ...formData, endDateTime: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingBooking ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {showToast && (
        <Toast
          id="bookingToast"
          message={toastMessage}
          type={toastType}
          show={showToast}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
