'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive = (path: string) => pathname === path;

  const menuItems = [
    { path: '/resource-types', label: 'Resource Types', icon: 'bi-tags', roles: ['Admin'] },
    { path: '/buildings', label: 'Buildings', icon: 'bi-building', roles: ['Admin'] },
    { path: '/facilities', label: 'Facilities', icon: 'bi-tools', roles: ['Admin', 'User'] },
    { path: '/cupboards', label: 'Cupboards', icon: 'bi-archive', roles: ['Admin', 'User'] },
    { path: '/shelves', label: 'Shelves', icon: 'bi-layers', roles: ['Admin', 'User'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  // Hide sidebar if no items to show
  if (filteredMenuItems.length === 0) {
    return null;
  }

  return (
    <div className="sidebar d-none d-lg-block">
      <div className="p-3">
        <h6 className="text-muted text-uppercase small fw-semibold mb-3 px-2" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
          More Options
        </h6>
        <ul className="nav nav-pills flex-column">
          {filteredMenuItems.map((item) => (
            <li key={item.path} className="nav-item mb-1">
              <Link
                href={item.path}
                className={`nav-link ${isActive(item.path) ? 'active-link' : 'text-dark'}`}
                style={{
                  borderRadius: '8px',
                  padding: '0.6rem 1rem',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <i className={`bi ${item.icon} me-2`}></i>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
