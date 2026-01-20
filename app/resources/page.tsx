'use client';

import { useState, useMemo } from 'react';
import { getResources, getResourceTypes, getBuildings, getFacilitiesByResourceId, type Resource } from '@/lib/data';
import Modal from '@/components/Modal';
import Toast from '@/components/Toast';
import SearchFilter from '@/components/SearchFilter';

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>(getResources());
  const resourceTypes = getResourceTypes();
  const buildings = getBuildings();
  const [showModal, setShowModal] = useState(false);
  const [showFacilitiesModal, setShowFacilitiesModal] = useState(false);
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    resourceTypeId: '',
    buildingId: '',
    floorNumber: 1,
    description: '',
  });

  const getResourceTypeName = (id: string) => {
    return resourceTypes.find(t => t.id === id)?.name || 'N/A';
  };

  const getBuildingName = (id: string) => {
    return buildings.find(b => b.id === id)?.name || 'N/A';
  };

  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      const resourceTypeName = getResourceTypeName(resource.resourceTypeId).toLowerCase();
      const buildingName = getBuildingName(resource.buildingId).toLowerCase();
      const matchesSearch = 
        resource.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        resourceTypeName.includes(searchValue.toLowerCase()) ||
        buildingName.includes(searchValue.toLowerCase());
      const matchesFilter = !filterValue || resource.resourceTypeId === filterValue;
      return matchesSearch && matchesFilter;
    });
  }, [resources, searchValue, filterValue, resourceTypes, buildings]);

  const handleAdd = () => {
    setEditingResource(null);
    setFormData({ name: '', resourceTypeId: '', buildingId: '', floorNumber: 1, description: '' });
    setShowModal(true);
  };

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource);
    setFormData({
      name: resource.name,
      resourceTypeId: resource.resourceTypeId,
      buildingId: resource.buildingId,
      floorNumber: resource.floorNumber,
      description: resource.description,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      setResources(resources.filter(r => r.id !== id));
      showNotification('Resource deleted successfully', 'success');
    }
  };

  const handleViewFacilities = (id: string) => {
    setSelectedResourceId(id);
    setShowFacilitiesModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingResource) {
      setResources(resources.map(r => 
        r.id === editingResource.id 
          ? { ...r, ...formData }
          : r
      ));
      showNotification('Resource updated successfully', 'success');
    } else {
      const newResource: Resource = {
        id: Date.now().toString(),
        ...formData,
      };
      setResources([...resources, newResource]);
      showNotification('Resource added successfully', 'success');
    }
    setShowModal(false);
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const facilities = selectedResourceId ? getFacilitiesByResourceId(selectedResourceId) : [];

  const resourceTypeOptions = resourceTypes.map(type => ({
    value: type.id,
    label: type.name
  }));

  return (
    <div>
      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h1>
            <i className="bi bi-box-seam me-2 text-primary"></i>
            Resources
          </h1>
          <p className="text-muted mb-0">Manage and view all resources</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          <i className="bi bi-plus-circle me-2"></i>
          Add Resource
        </button>
      </div>

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filterValue={filterValue}
        onFilterChange={setFilterValue}
        filterOptions={resourceTypeOptions}
        placeholder="Search by name, type, or building..."
      />

      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Resource Name</th>
                  <th>Resource Type</th>
                  <th>Building</th>
                  <th>Floor</th>
                  <th>Description</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResources.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-muted py-4">
                      <i className="bi bi-inbox me-2"></i>
                      No resources found
                    </td>
                  </tr>
                ) : (
                  filteredResources.map((resource) => (
                    <tr key={resource.id}>
                      <td className="fw-semibold">{resource.name}</td>
                      <td>{getResourceTypeName(resource.resourceTypeId)}</td>
                      <td>{getBuildingName(resource.buildingId)}</td>
                      <td>{resource.floorNumber}</td>
                      <td>{resource.description}</td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-info me-2"
                          onClick={() => handleViewFacilities(resource.id)}
                          title="View Facilities"
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEdit(resource)}
                          title="Edit"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(resource.id)}
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
        id="resourceModal"
        title={editingResource ? 'Edit Resource' : 'Add Resource'}
        show={showModal}
        onClose={() => setShowModal(false)}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Resource Name</label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Resource Type</label>
              <select
                className="form-select"
                value={formData.resourceTypeId}
                onChange={(e) => setFormData({ ...formData, resourceTypeId: e.target.value })}
                required
              >
                <option value="">Select Resource Type</option>
                {resourceTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Building</label>
              <select
                className="form-select"
                value={formData.buildingId}
                onChange={(e) => setFormData({ ...formData, buildingId: e.target.value })}
                required
              >
                <option value="">Select Building</option>
                {buildings.map(building => (
                  <option key={building.id} value={building.id}>{building.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Floor Number</label>
            <input
              type="number"
              className="form-control"
              value={formData.floorNumber}
              onChange={(e) => setFormData({ ...formData, floorNumber: parseInt(e.target.value) })}
              min="1"
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
              {editingResource ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        id="facilitiesModal"
        title="Facilities"
        show={showFacilitiesModal}
        onClose={() => setShowFacilitiesModal(false)}
      >
        {facilities.length > 0 ? (
          <ul className="list-group">
            {facilities.map((facility) => (
              <li key={facility.id} className="list-group-item">
                <h6>{facility.name}</h6>
                <small className="text-muted">{facility.details}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No facilities linked to this resource.</p>
        )}
      </Modal>

      {showToast && (
        <Toast
          id="resourceToast"
          message={toastMessage}
          type={toastType}
          show={showToast}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
