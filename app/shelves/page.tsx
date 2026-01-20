'use client';

import { useState, useMemo } from 'react';
import { getShelves, getCupboards, type Shelf } from '@/lib/data';
import Modal from '@/components/Modal';
import Toast from '@/components/Toast';
import SearchFilter from '@/components/SearchFilter';

export default function ShelvesPage() {
  const [shelves, setShelves] = useState<Shelf[]>(getShelves());
  const cupboards = getCupboards();
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const [editingShelf, setEditingShelf] = useState<Shelf | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [formData, setFormData] = useState({
    shelfNumber: 1,
    capacity: 1,
    description: '',
    cupboardId: '',
  });

  const getCupboardName = (id: string) => {
    return cupboards.find(c => c.id === id)?.name || 'N/A';
  };

  const filteredShelves = useMemo(() => {
    return shelves.filter(shelf => {
      const cupboardName = getCupboardName(shelf.cupboardId).toLowerCase();
      const matchesSearch = 
        shelf.description.toLowerCase().includes(searchValue.toLowerCase()) ||
        cupboardName.includes(searchValue.toLowerCase());
      const matchesFilter = !filterValue || shelf.cupboardId === filterValue;
      return matchesSearch && matchesFilter;
    });
  }, [shelves, searchValue, filterValue, cupboards]);

  const handleAdd = () => {
    setEditingShelf(null);
    setFormData({ shelfNumber: 1, capacity: 1, description: '', cupboardId: '' });
    setShowModal(true);
  };

  const handleEdit = (shelf: Shelf) => {
    setEditingShelf(shelf);
    setFormData({
      shelfNumber: shelf.shelfNumber,
      capacity: shelf.capacity,
      description: shelf.description,
      cupboardId: shelf.cupboardId,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this shelf?')) {
      setShelves(shelves.filter(s => s.id !== id));
      showNotification('Shelf deleted successfully', 'success');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingShelf) {
      setShelves(shelves.map(s => 
        s.id === editingShelf.id 
          ? { ...s, ...formData }
          : s
      ));
      showNotification('Shelf updated successfully', 'success');
    } else {
      const newShelf: Shelf = {
        id: Date.now().toString(),
        ...formData,
      };
      setShelves([...shelves, newShelf]);
      showNotification('Shelf added successfully', 'success');
    }
    setShowModal(false);
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const cupboardOptions = cupboards.map(cupboard => ({
    value: cupboard.id,
    label: cupboard.name
  }));

  return (
    <div>
      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h1>
            <i className="bi bi-layers me-2 text-primary"></i>
            Shelves
          </h1>
          <p className="text-muted mb-0">Manage shelves linked to cupboards</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          <i className="bi bi-plus-circle me-2"></i>
          Add Shelf
        </button>
      </div>

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filterValue={filterValue}
        onFilterChange={setFilterValue}
        filterOptions={cupboardOptions}
        placeholder="Search by description or cupboard..."
      />

      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Shelf Number</th>
                  <th>Capacity</th>
                  <th>Description</th>
                  <th>Linked Cupboard</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredShelves.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-muted py-4">
                      <i className="bi bi-inbox me-2"></i>
                      No shelves found
                    </td>
                  </tr>
                ) : (
                  filteredShelves.map((shelf) => (
                    <tr key={shelf.id}>
                      <td className="fw-semibold">{shelf.shelfNumber}</td>
                      <td>{shelf.capacity}</td>
                      <td>{shelf.description}</td>
                      <td>{getCupboardName(shelf.cupboardId)}</td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEdit(shelf)}
                          title="Edit"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(shelf.id)}
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
        id="shelfModal"
        title={editingShelf ? 'Edit Shelf' : 'Add Shelf'}
        show={showModal}
        onClose={() => setShowModal(false)}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Linked Cupboard</label>
            <select
              className="form-select"
              value={formData.cupboardId}
              onChange={(e) => setFormData({ ...formData, cupboardId: e.target.value })}
              required
            >
              <option value="">Select Cupboard</option>
              {cupboards.map(cupboard => (
                <option key={cupboard.id} value={cupboard.id}>{cupboard.name}</option>
              ))}
            </select>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Shelf Number</label>
              <input
                type="number"
                className="form-control"
                value={formData.shelfNumber}
                onChange={(e) => setFormData({ ...formData, shelfNumber: parseInt(e.target.value) })}
                min="1"
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Capacity</label>
              <input
                type="number"
                className="form-control"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                min="1"
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
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
              {editingShelf ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </Modal>

      {showToast && (
        <Toast
          id="shelfToast"
          message={toastMessage}
          type={toastType}
          show={showToast}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
