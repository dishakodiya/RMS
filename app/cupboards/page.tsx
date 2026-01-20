'use client';

import { useState, useMemo } from 'react';
import { getCupboards, type Cupboard } from '@/lib/data';
import Modal from '@/components/Modal';
import Toast from '@/components/Toast';
import SearchFilter from '@/components/SearchFilter';

export default function CupboardsPage() {
  const [cupboards, setCupboards] = useState<Cupboard[]>(getCupboards());
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const [editingCupboard, setEditingCupboard] = useState<Cupboard | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    resourceLocation: '',
    totalShelves: 1,
  });

  const filteredCupboards = useMemo(() => {
    return cupboards.filter(cupboard =>
      cupboard.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      cupboard.resourceLocation.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [cupboards, searchValue]);

  const handleAdd = () => {
    setEditingCupboard(null);
    setFormData({ name: '', resourceLocation: '', totalShelves: 1 });
    setShowModal(true);
  };

  const handleEdit = (cupboard: Cupboard) => {
    setEditingCupboard(cupboard);
    setFormData({
      name: cupboard.name,
      resourceLocation: cupboard.resourceLocation,
      totalShelves: cupboard.totalShelves,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this cupboard?')) {
      setCupboards(cupboards.filter(c => c.id !== id));
      showNotification('Cupboard deleted successfully', 'success');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCupboard) {
      setCupboards(cupboards.map(c => 
        c.id === editingCupboard.id 
          ? { ...c, ...formData }
          : c
      ));
      showNotification('Cupboard updated successfully', 'success');
    } else {
      const newCupboard: Cupboard = {
        id: Date.now().toString(),
        ...formData,
      };
      setCupboards([...cupboards, newCupboard]);
      showNotification('Cupboard added successfully', 'success');
    }
    setShowModal(false);
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  return (
    <div>
      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h1>
            <i className="bi bi-archive me-2 text-primary"></i>
            Cupboards
          </h1>
          <p className="text-muted mb-0">Manage storage cupboards</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          <i className="bi bi-plus-circle me-2"></i>
          Add Cupboard
        </button>
      </div>

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        placeholder="Search by name or location..."
      />

      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Cupboard Name</th>
                  <th>Resource Location</th>
                  <th>Total Shelves</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCupboards.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-muted py-4">
                      <i className="bi bi-inbox me-2"></i>
                      No cupboards found
                    </td>
                  </tr>
                ) : (
                  filteredCupboards.map((cupboard) => (
                    <tr key={cupboard.id}>
                      <td className="fw-semibold">{cupboard.name}</td>
                      <td>{cupboard.resourceLocation}</td>
                      <td>{cupboard.totalShelves}</td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEdit(cupboard)}
                          title="Edit"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(cupboard.id)}
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
        id="cupboardModal"
        title={editingCupboard ? 'Edit Cupboard' : 'Add Cupboard'}
        show={showModal}
        onClose={() => setShowModal(false)}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Cupboard Name</label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Resource Location</label>
            <input
              type="text"
              className="form-control"
              value={formData.resourceLocation}
              onChange={(e) => setFormData({ ...formData, resourceLocation: e.target.value })}
              placeholder="e.g., Classroom 101"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Total Shelves</label>
            <input
              type="number"
              className="form-control"
              value={formData.totalShelves}
              onChange={(e) => setFormData({ ...formData, totalShelves: parseInt(e.target.value) })}
              min="1"
              required
            />
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
              {editingCupboard ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </Modal>

      {showToast && (
        <Toast
          id="cupboardToast"
          message={toastMessage}
          type={toastType}
          show={showToast}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
