import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export default async function UsersPage() {
  const users = await prisma.users.findMany({
    select: {
      user_id: true,
      name: true,
      email: true,
      role: true,
      created_at: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  return (
    <div className="container">
      <h1>Users Management</h1>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created At</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={5} className="empty">
                No users found
              </td>
            </tr>
          ) : (
            users.map(u => (
              <tr key={u.user_id}>
                <td>{u.user_id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`badge ${u.role.toLowerCase()}`}>
                    {u.role}
                  </span>
                </td>
                <td>
                  {u.created_at
                    ? new Date(u.created_at).toLocaleDateString()
                    : '-'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* CSS */}
      <style>{`
        .container {
          padding: 24px;
          font-family: Arial, sans-serif;
        }

        h1 {
          margin-bottom: 16px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: #fff;
        }

        th, td {
          padding: 12px;
          border: 1px solid #ddd;
          text-align: left;
        }

        th {
          background-color: #f5f5f5;
        }

        tr:hover {
          background-color: #f9f9f9;
        }

        .empty {
          text-align: center;
          color: #777;
          padding: 20px;
        }

        .badge {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          color: #fff;
        }

        .admin {
          background-color: #dc3545;
        }

        .approver {
          background-color: #ffc107;
          color: #000;
        }

        .user {
          background-color: #0dcaf0;
        }
      `}</style>
    </div>
  );
}
