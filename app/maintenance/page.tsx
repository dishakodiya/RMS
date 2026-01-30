// 'use client';

// import { useState, useMemo } from 'react';
// import { getMaintenance, getResources, type Maintenance } from '@/lib/data';
// import StatusBadge from '@/components/StatusBadge';
// import Modal from '@/components/Modal';
// import Toast from '@/components/Toast';
// import SearchFilter from '@/components/SearchFilter';

// export default function MaintenanceClientPage() {
//   const [maintenance, setMaintenance] = useState<Maintenance[]>(getMaintenance());
//   const resources = getResources();
//   const [showModal, setShowModal] = useState(false);
//   const [showToast, setShowToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState('');
//   const [toastType, setToastType] = useState<'success' | 'error' | 'info' | 'warning'>('success');
//   const [editingMaintenance, setEditingMaintenance] = useState<Maintenance | null>(null);
//   const [searchValue, setSearchValue] = useState('');
//   const [filterValue, setFilterValue] = useState('');
//   const [formData, setFormData] = useState({
//     resourceId: '',
//     maintenanceType: '',
//     scheduledDate: '',
//     status: 'Scheduled' as 'Scheduled' | 'In Progress' | 'Completed',
//     notes: '',
//   });

//   const getResourceName = (id: string) => {
//     return resources.find(r => r.id === id)?.name || 'N/A';
//   };

//   const filteredMaintenance = useMemo(() => {
//     return maintenance.filter(maint => {
//       const resourceName = getResourceName(maint.resourceId).toLowerCase();
//       const matchesSearch = 
//         resourceName.includes(searchValue.toLowerCase()) ||
//         maint.maintenanceType.toLowerCase().includes(searchValue.toLowerCase()) ||
//         maint.notes.toLowerCase().includes(searchValue.toLowerCase());
//       const matchesFilter = !filterValue || maint.status === filterValue;
//       return matchesSearch && matchesFilter;
//     });
//   }, [maintenance, searchValue, filterValue, resources]);

//   const handleAdd = () => {
//     setEditingMaintenance(null);
//     setFormData({
//       resourceId: '',
//       maintenanceType: '',
//       scheduledDate: '',
//       status: 'Scheduled',
//       notes: '',
//     });
//     setShowModal(true);
//   };

//   const handleEdit = (maint: Maintenance) => {
//     setEditingMaintenance(maint);
//     setFormData({
//       resourceId: maint.resourceId,
//       maintenanceType: maint.maintenanceType,
//       scheduledDate: new Date(maint.scheduledDate).toISOString().slice(0, 16),
//       status: maint.status,
//       notes: maint.notes,
//     });
//     setShowModal(true);
//   };

//   const handleDelete = (id: string) => {
//     if (confirm('Are you sure you want to delete this maintenance record?')) {
//       setMaintenance(maintenance.filter(m => m.id !== id));
//       showNotification('Maintenance record deleted successfully', 'success');
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (editingMaintenance) {
//       setMaintenance(maintenance.map(m => 
//         m.id === editingMaintenance.id 
//           ? { ...m, ...formData, scheduledDate: new Date(formData.scheduledDate).toISOString() }
//           : m
//       ));
//       showNotification('Maintenance record updated successfully', 'success');
//     } else {
//       const newMaintenance: Maintenance = {
//         id: Date.now().toString(),
//         ...formData,
//         scheduledDate: new Date(formData.scheduledDate).toISOString(),
//       };
//       setMaintenance([...maintenance, newMaintenance]);
//       showNotification('Maintenance record added successfully', 'success');
//     }
//     setShowModal(false);
//   };

//   const showNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
//     setToastMessage(message);
//     setToastType(type);
//     setShowToast(true);
//   };

//   const statusOptions = [
//     { value: 'Scheduled', label: 'Scheduled' },
//     { value: 'In Progress', label: 'In Progress' },
//     { value: 'Completed', label: 'Completed' },
//   ];

//   return (
//     <div>
//       <div className="page-header d-flex justify-content-between align-items-center">
//         <div>
//           <h1>
//             <i className="bi bi-wrench me-2 text-primary"></i>
//             Maintenance
//           </h1>
//           <p className="text-muted mb-0">Schedule and track maintenance activities</p>
//         </div>
//         <button className="btn btn-primary" onClick={handleAdd}>
//           <i className="bi bi-plus-circle me-2"></i>
//           Schedule Maintenance
//         </button>
//       </div>

//       <SearchFilter
//         searchValue={searchValue}
//         onSearchChange={setSearchValue}
//         filterValue={filterValue}
//         onFilterChange={setFilterValue}
//         filterOptions={statusOptions}
//         placeholder="Search by resource, type, or notes..."
//       />

//       <div className="card">
//         <div className="card-body p-0">
//           <div className="table-responsive">
//             <table className="table table-hover mb-0">
//               <thead>
//                 <tr>
//                   <th>Resource</th>
//                   <th>Maintenance Type</th>
//                   <th>Scheduled Date</th>
//                   <th>Status</th>
//                   <th>Notes</th>
//                   <th className="text-end">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredMaintenance.length === 0 ? (
//                   <tr>
//                     <td colSpan={6} className="text-center text-muted py-4">
//                       <i className="bi bi-inbox me-2"></i>
//                       No maintenance records found
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredMaintenance.map((maint) => (
//                     <tr key={maint.id}>
//                       <td className="fw-semibold">{getResourceName(maint.resourceId)}</td>
//                       <td>{maint.maintenanceType}</td>
//                       <td>{new Date(maint.scheduledDate).toLocaleString()}</td>
//                       <td><StatusBadge status={maint.status} /></td>
//                       <td>{maint.notes}</td>
//                       <td className="text-end">
//                         <button
//                           className="btn btn-sm btn-outline-primary me-2"
//                           onClick={() => handleEdit(maint)}
//                           title="Edit"
//                         >
//                           <i className="bi bi-pencil"></i>
//                         </button>
//                         <button
//                           className="btn btn-sm btn-outline-danger"
//                           onClick={() => handleDelete(maint.id)}
//                           title="Delete"
//                         >
//                           <i className="bi bi-trash"></i>
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       <Modal
//         id="maintenanceModal"
//         title={editingMaintenance ? 'Edit Maintenance' : 'Schedule Maintenance'}
//         show={showModal}
//         onClose={() => setShowModal(false)}
//         size="lg"
//       >
//         <form onSubmit={handleSubmit}>
//           <div className="row">
//             <div className="col-md-6 mb-3">
//               <label className="form-label">Resource</label>
//               <select
//                 className="form-select"
//                 value={formData.resourceId}
//                 onChange={(e) => setFormData({ ...formData, resourceId: e.target.value })}
//                 required
//               >
//                 <option value="">Select Resource</option>
//                 {resources.map(resource => (
//                   <option key={resource.id} value={resource.id}>{resource.name}</option>
//                 ))}
//               </select>
//             </div>
//             <div className="col-md-6 mb-3">
//               <label className="form-label">Maintenance Type</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={formData.maintenanceType}
//                 onChange={(e) => setFormData({ ...formData, maintenanceType: e.target.value })}
//                 placeholder="e.g., Routine Inspection, Repair"
//                 required
//               />
//             </div>
//           </div>
//           <div className="row">
//             <div className="col-md-6 mb-3">
//               <label className="form-label">Scheduled Date & Time</label>
//               <input
//                 type="datetime-local"
//                 className="form-control"
//                 value={formData.scheduledDate}
//                 onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
//                 required
//               />
//             </div>
//             <div className="col-md-6 mb-3">
//               <label className="form-label">Status</label>
//               <select
//                 className="form-select"
//                 value={formData.status}
//                 onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
//                 required
//               >
//                 <option value="Scheduled">Scheduled</option>
//                 <option value="In Progress">In Progress</option>
//                 <option value="Completed">Completed</option>
//               </select>
//             </div>
//           </div>
//           <div className="mb-3">
//             <label className="form-label">Notes</label>
//             <textarea
//               className="form-control"
//               value={formData.notes}
//               onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
//               rows={3}
//               required
//             />
//           </div>
//           <div className="d-flex justify-content-end gap-2">
//             <button
//               type="button"
//               className="btn btn-secondary"
//               data-bs-dismiss="modal"
//             >
//               Cancel
//             </button>
//             <button type="submit" className="btn btn-primary">
//               {editingMaintenance ? 'Update' : 'Schedule'}
//             </button>
//           </div>
//         </form>
//       </Modal>

//       {showToast && (
//         <Toast
//           id="maintenanceToast"
//           message={toastMessage}
//           type={toastType}
//           show={showToast}
//           onClose={() => setShowToast(false)}
//         />
//       )}
//     </div>
//   );
// }




import { prisma } from '@/lib/prisma';
import MaintenanceClientPage from './MaintenanceClientPage';
import type { Maintenance } from '@/lib/data';
export const runtime = 'nodejs';

export default async function MaintenancePage() {
  const data = await prisma.maintenance.findMany({
    select: {
      maintenance_id: true,
      resource_id: true,      
      user_id: true,        
      maintenance_type: true,
      scheduled_date: true,
      status: true,          
      notes: true,          
    },
    orderBy: {
      maintenance_id: 'desc',
    },
  });

  const maintenance: Maintenance[] = data.map(rt => ({
    id: rt.maintenance_id.toString(),
    resourceId: rt.resource_id.toString(),
    maintenanceType: rt.maintenance_type ?? '',
    scheduledDate: rt.scheduled_date?.toISOString() ?? '',
    status: (rt.status ?? 'Scheduled') as Maintenance['status'],
    notes: rt.notes ?? '',
  }));

  return <MaintenanceClientPage initialMaintenance={maintenance}/>;
}
