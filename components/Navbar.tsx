'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
  };

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'bi-speedometer2', roles: ['Admin', 'User', 'Approver'] },
    { path: '/resources', label: 'Resources', icon: 'bi-box-seam', roles: ['Admin', 'User', 'Approver'] },
    { path: '/bookings', label: 'Bookings', icon: 'bi-calendar-check', roles: ['Admin', 'User', 'Approver'] },
    { path: '/maintenance', label: 'Maintenance', icon: 'bi-wrench', roles: ['Admin', 'Approver'] },
    { path: '/reports', label: 'Reports', icon: 'bi-file-earmark-text', roles: ['Admin', 'Approver'] },
    { path: '/users', label: 'Users', icon: 'bi-people', roles: ['Admin'] },
    
  ];

  const filteredNavItems = navItems.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom fixed-top" style={{ zIndex: 1030, boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
      <div className="container-fluid px-4">
        <Link className="navbar-brand fw-semibold text-dark" href="/dashboard" style={{ fontSize: '1.1rem' }}>
          <i className="bi bi-box-seam me-2 text-primary"></i>
          Resource Management System
        </Link>
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {filteredNavItems.map((item) => (
              <li key={item.path} className="nav-item">
                <Link
                  href={item.path}
                  className={`nav-link px-3 ${isActive(item.path) ? 'active-link' : 'text-dark'}`}
                  style={{
                    fontWeight: isActive(item.path) ? '500' : '400',
                    borderRadius: '6px',
                    margin: '0 2px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <i className={`bi ${item.icon} me-1`}></i>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="dropdown">
            <button
              className="btn btn-link text-dark text-decoration-none dropdown-toggle d-flex align-items-center"
              type="button"
              id="profileDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ border: 'none', outline: 'none' }}
            >
              <i className="bi bi-person-circle me-2" style={{ fontSize: '1.3rem' }}></i>
              <span className="d-none d-md-inline">{user?.email}</span>
              <span className="badge bg-primary ms-2 d-none d-md-inline">{user?.role}</span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-sm" aria-labelledby="profileDropdown" style={{ border: 'none', borderRadius: '8px', marginTop: '8px' }}>
              <li>
                <div className="dropdown-item-text">
                  <small className="text-muted d-block">{user?.email}</small>
                  <small className="text-muted">{user?.role}</small>
                </div>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
