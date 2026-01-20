'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Admin' | 'User' | 'Approver' | ''>('');
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !role) {
      setError('Please fill in all fields');
      return;
    }

    if (login(email, password, role as 'Admin' | 'User' | 'Approver')) {
      router.push('/dashboard');
    } else {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <i className="bi bi-box-seam text-primary" style={{ fontSize: '3rem' }}></i>
            <h2 className="mt-3 mb-1">RMS Login</h2>
            <p className="text-muted">Resource Management System</p>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                <i className="bi bi-envelope me-2"></i>Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                <i className="bi bi-lock me-2"></i>Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="role" className="form-label">
                <i className="bi bi-person-badge me-2"></i>Role
              </label>
              <select
                className="form-select"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'Admin' | 'User' | 'Approver')}
                required
              >
                <option value="">Select a role</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
                <option value="Approver">Approver</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              <i className="bi bi-box-arrow-in-right me-2"></i>
              Login
            </button>
          </form>

          <div className="mt-4 text-center text-muted small">
            <p>Demo Credentials: Use any email/password with your selected role</p>
          </div>
        </div>
      </div>
    </div>
  );
}
