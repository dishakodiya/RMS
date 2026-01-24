'use client';

import { useState, useMemo } from 'react';
import Modal from '@/components/Modal';
import Toast from '@/components/Toast';
import SearchFilter from '@/components/SearchFilter';
import React from 'react';

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export default function UsersClientPage({
  initialUsers,
}: {
  initialUsers: User[];
}) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] =
    useState<'success' | 'error' | 'info' | 'warning'>('success');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'User',
  });

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.email.toLowerCase().includes(searchValue.toLowerCase());
      const matchesFilter = !filterValue || user.role === filterValue;
      return matchesSearch && matchesFilter;
    });
  }, [users, searchValue, filterValue]);

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'User' });
    setShowModal(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
      showNotification('User deleted successfully', 'success');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingUser) {
      setUsers(users.map(u =>
        u.id === editingUser.id ? { ...u, ...formData } : u
      ));
      showNotification('User updated successfully', 'success');
    } else {
      const newUser: User = {
        id: Date.now().toString(), // dummy
        ...formData,
        createdAt: new Date().toISOString(),
      };
      setUsers([...users, newUser]);
      showNotification('User added successfully', 'success');
    }

    setShowModal(false);
  };

  const showNotification = (
    message: string,
    type: 'success' | 'error' | 'info' | 'warning'
  ) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const roleOptions = [
    { value: 'Admin', label: 'Admin' },
    { value: 'User', label: 'User' },
    { value: 'Approver', label: 'Approver' },
  ];

  return (
    <div>
      {/* HEADER */}
      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h1>
            <i className="bi bi-people me-2 text-primary"></i>
            Users Management
          </h1>
          <p className="text-muted mb-0">
            Manage system users and their roles
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          <i className="bi bi-plus-circle me-2"></i>
          Add User
        </button>
      </div>

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filterValue={filterValue}
        onFilterChange={setFilterValue}
        filterOptions={roleOptions}
        placeholder="Search by name or email..."
      />

      {/* TABLE */}
      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created At</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-muted py-4">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td className="fw-semibold">{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge ${
                          user.role === 'Admin'
                            ? 'bg-danger'
                            : user.role === 'Approver'
                            ? 'bg-warning'
                            : 'bg-info'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEdit(user)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(user.id)}
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

      {/* MODAL */}
      <Modal
        id="userModal"
        title={editingUser ? 'Edit User' : 'Add User'}
        show={showModal}
        onClose={() => setShowModal(false)}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              className="form-control"
              value={formData.name}
              onChange={e =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={formData.email}
              onChange={e =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              value={formData.role}
              onChange={e =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="Admin">Admin</option>
              <option value="User">User</option>
              <option value="Approver">Approver</option>
            </select>
          </div>

          <div className="text-end">
            <button className="btn btn-primary">
              {editingUser ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </Modal>

      {showToast && (
        <Toast
          id="userToast"
          message={toastMessage}
          type={toastType}
          show={showToast}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}






