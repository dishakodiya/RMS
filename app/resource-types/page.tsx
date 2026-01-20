'use client';

import { useState, useMemo } from 'react';
import { getResourceTypes, type ResourceType } from '@/lib/data';
import Modal from '@/components/Modal';
import Toast from '@/components/Toast';
import SearchFilter from '@/components/SearchFilter';

export default function ResourceTypesPage() {
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>(getResourceTypes());
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const [editingType, setEditingType] = useState<ResourceType | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const filteredTypes = useMemo(() => {
    return resourceTypes.filter(type =>
      type.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      type.description.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [resourceTypes, searchValue]);

  const handleAdd = () => {
    setEditingType(null);
    setFormData({ name: '', description: '' });
    setShowModal(true);
  };

  const handleEdit = (type: ResourceType) => {
    setEditingType(type);
    setFormData({
      name: type.name,
      description: type.description,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this resource type?')) {
      setResourceTypes(resourceTypes.filter(t => t.id !== id));
      showNotification('Resource type deleted successfully', 'success');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingType) {
      setResourceTypes(resourceTypes.map(t => 
        t.id === editingType.id 
          ? { ...t, ...formData }
          : t
      ));
      showNotification('Resource type updated successfully', 'success');
    } else {
      const newType: ResourceType = {
        id: Date.now().toString(),
        ...formData,
      };
      setResourceTypes([...resourceTypes, newType]);
      showNotification('Resource type added successfully', 'success');
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
            <i className="bi bi-tags me-2 text-primary"></i>
            Resource Types
          </h1>
          <p className="text-muted mb-0">Manage resource type categories</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          <i className="bi bi-plus-circle me-2"></i>
          Add Resource Type
        </button>
      </div>

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        placeholder="Search by name or description..."
      />

      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTypes.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center text-muted py-4">
                      <i className="bi bi-inbox me-2"></i>
                      No resource types found
                    </td>
                  </tr>
                ) : (
                  filteredTypes.map((type) => (
                    <tr key={type.id}>
                      <td className="fw-semibold">{type.name}</td>
                      <td>{type.description}</td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEdit(type)}
                          title="Edit"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(type.id)}
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
        id="resourceTypeModal"
        title={editingType ? 'Edit Resource Type' : 'Add Resource Type'}
        show={showModal}
        onClose={() => setShowModal(false)}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
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
              {editingType ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </Modal>

      {showToast && (
        <Toast
          id="resourceTypeToast"
          message={toastMessage}
          type={toastType}
          show={showToast}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
