'use client';

import { useState, useMemo } from 'react';
import { getFacilities, getResources, type Facility } from '@/lib/data';
import Modal from '@/components/Modal';
import Toast from '@/components/Toast';
import SearchFilter from '@/components/SearchFilter';

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>(getFacilities());
  const resources = getResources();
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    details: '',
    resourceId: '',
  });

  const getResourceName = (id: string) => {
    return resources.find(r => r.id === id)?.name || 'N/A';
  };

  const filteredFacilities = useMemo(() => {
    return facilities.filter(facility => {
      const resourceName = getResourceName(facility.resourceId).toLowerCase();
      const matchesSearch = 
        facility.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        facility.details.toLowerCase().includes(searchValue.toLowerCase()) ||
        resourceName.includes(searchValue.toLowerCase());
      const matchesFilter = !filterValue || facility.resourceId === filterValue;
      return matchesSearch && matchesFilter;
    });
  }, [facilities, searchValue, filterValue, resources]);

  const handleAdd = () => {
    setEditingFacility(null);
    setFormData({ name: '', details: '', resourceId: '' });
    setShowModal(true);
  };

  const handleEdit = (facility: Facility) => {
    setEditingFacility(facility);
    setFormData({
      name: facility.name,
      details: facility.details,
      resourceId: facility.resourceId,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this facility?')) {
      setFacilities(facilities.filter(f => f.id !== id));
      showNotification('Facility deleted successfully', 'success');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFacility) {
      setFacilities(facilities.map(f => 
        f.id === editingFacility.id 
          ? { ...f, ...formData }
          : f
      ));
      showNotification('Facility updated successfully', 'success');
    } else {
      const newFacility: Facility = {
        id: Date.now().toString(),
        ...formData,
      };
      setFacilities([...facilities, newFacility]);
      showNotification('Facility added successfully', 'success');
    }
    setShowModal(false);
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const resourceOptions = resources.map(resource => ({
    value: resource.id,
    label: resource.name
  }));

  return (
    <div>
      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h1>
            <i className="bi bi-tools me-2 text-primary"></i>
            Facilities
          </h1>
          <p className="text-muted mb-0">Manage facilities linked to resources</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          <i className="bi bi-plus-circle me-2"></i>
          Add Facility
        </button>
      </div>

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filterValue={filterValue}
        onFilterChange={setFilterValue}
        filterOptions={resourceOptions}
        placeholder="Search by facility name, details, or resource..."
      />

      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Facility Name</th>
                  <th>Details</th>
                  <th>Linked Resource</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFacilities.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-muted py-4">
                      <i className="bi bi-inbox me-2"></i>
                      No facilities found
                    </td>
                  </tr>
                ) : (
                  filteredFacilities.map((facility) => (
                    <tr key={facility.id}>
                      <td className="fw-semibold">{facility.name}</td>
                      <td>{facility.details}</td>
                      <td>{getResourceName(facility.resourceId)}</td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEdit(facility)}
                          title="Edit"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(facility.id)}
                          title="Delete"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
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
        id="facilityModal"
        title={editingFacility ? 'Edit Facility' : 'Add Facility'}
        show={showModal}
        onClose={() => setShowModal(false)}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Facility Name</label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Details</label>
            <textarea
              className="form-control"
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              rows={3}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Linked Resource</label>
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
          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingFacility ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </Modal>

      {showToast && (
        <Toast
          id="facilityToast"
          message={toastMessage}
          type={toastType}
          show={showToast}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
