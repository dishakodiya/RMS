// 'use client';

// import { useState, useMemo } from 'react';
// import { getBuildings, type Building } from '@/lib/data';
// import Modal from '@/components/Modal';
// import Toast from '@/components/Toast';
// import SearchFilter from '@/components/SearchFilter';

// export default function BuildingsClientPage() {

//   const [buildings, setBuildings] = useState<Building[]>(getBuildings());
//   const [showModal, setShowModal] = useState(false);
//   const [showToast, setShowToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState('');
//   const [toastType, setToastType] = useState<'success' | 'error' | 'info' | 'warning'>('success');
//   const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
//   const [searchValue, setSearchValue] = useState('');
//   const [formData, setFormData] = useState({
//     name: '',
//     buildingNumber: '',
//     totalFloors: 1,
//   });

//   const filteredBuildings = useMemo(() => {
//     return buildings.filter(building =>
//       building.name.toLowerCase().includes(searchValue.toLowerCase()) ||
//       building.buildingNumber.toLowerCase().includes(searchValue.toLowerCase())
//     );
//   }, [buildings, searchValue]);

//   const handleAdd = () => {
//     setEditingBuilding(null);
//     setFormData({ name: '', buildingNumber: '', totalFloors: 1 });
//     setShowModal(true);
//   };

//   const handleEdit = (building: Building) => {
//     setEditingBuilding(building);
//     setFormData({
//       name: building.name,
//       buildingNumber: building.buildingNumber,
//       totalFloors: building.totalFloors,
//     });
//     setShowModal(true);
//   };

//   const handleDelete = (id: string) => {
//     if (confirm('Are you sure you want to delete this building?')) {
//       setBuildings(buildings.filter(b => b.id !== id));
//       showNotification('Building deleted successfully', 'success');
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (editingBuilding) {
//       setBuildings(buildings.map(b => 
//         b.id === editingBuilding.id 
//           ? { ...b, ...formData }
//           : b
//       ));
//       showNotification('Building updated successfully', 'success');
//     } else {
//       const newBuilding: Building = {
//         id: Date.now().toString(),
//         ...formData,
//       };
//       setBuildings([...buildings, newBuilding]);
//       showNotification('Building added successfully', 'success');
//     }
//     setShowModal(false);
//   };

//   const showNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
//     setToastMessage(message);
//     setToastType(type);
//     setShowToast(true);
//   };

//   return (
//     <div>
//       <div className="page-header d-flex justify-content-between align-items-center">
//         <div>
//           <h1>
//             <i className="bi bi-building me-2 text-primary"></i>
//             Buildings
//           </h1>
//           <p className="text-muted mb-0">Manage building information</p>
//         </div>
//         <button className="btn btn-primary" onClick={handleAdd}>
//           <i className="bi bi-plus-circle me-2"></i>
//           Add Building
//         </button>
//       </div>

//       <SearchFilter
//         searchValue={searchValue}
//         onSearchChange={setSearchValue}
//         placeholder="Search by name or building number..."
//       />

//       <div className="card">
//         <div className="card-body p-0">
//           <div className="table-responsive">
//             <table className="table table-hover mb-0">
//               <thead>
//                 <tr>
//                   <th>Building Name</th>
//                   <th>Building Number</th>
//                   <th>Total Floors</th>
//                   <th className="text-end">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredBuildings.length === 0 ? (
//                   <tr>
//                     <td colSpan={4} className="text-center text-muted py-4">
//                       <i className="bi bi-inbox me-2"></i>
//                       No buildings found
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredBuildings.map((building) => (
//                     <tr key={building.id}>
//                       <td className="fw-semibold">{building.name}</td>
//                       <td>{building.buildingNumber}</td>
//                       <td>{building.totalFloors}</td>
//                       <td className="text-end">
//                         <button
//                           className="btn btn-sm btn-outline-primary me-2"
//                           onClick={() => handleEdit(building)}
//                           title="Edit"
//                         >
//                           <i className="bi bi-pencil"></i>
//                         </button>
//                         <button
//                           className="btn btn-sm btn-outline-danger"
//                           onClick={() => handleDelete(building.id)}
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
//         id="buildingModal"
//         title={editingBuilding ? 'Edit Building' : 'Add Building'}
//         show={showModal}
//         onClose={() => setShowModal(false)}
//       >
//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label className="form-label">Building Name</label>
//             <input
//               type="text"
//               className="form-control"
//               value={formData.name}
//               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//               required
//             />
//           </div>
//           <div className="mb-3">
//             <label className="form-label">Building Number</label>
//             <input
//               type="text"
//               className="form-control"
//               value={formData.buildingNumber}
//               onChange={(e) => setFormData({ ...formData, buildingNumber: e.target.value })}
//               required
//             />
//           </div>
//           <div className="mb-3">
//             <label className="form-label">Total Floors</label>
//             <input
//               type="number"
//               className="form-control"
//               value={formData.totalFloors}
//               onChange={(e) => setFormData({ ...formData, totalFloors: parseInt(e.target.value) })}
//               min="1"
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
//               {editingBuilding ? 'Update' : 'Add'}
//             </button>
//           </div>
//         </form>
//       </Modal>

//       {showToast && (
//         <Toast
//           id="buildingToast"
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
import BuildingsClientPage from './BuildingsClientPage';

export const runtime = 'nodejs';

export default async function BuildingsTypesPage() {
  const data = await prisma.buildings.findMany({
    select: {
      building_id:true,
      building_name: true,
      building_number: true,
      total_floors:true
    },
    orderBy: {
      building_id: 'desc',
    },
  });

  // Convert DB → Client format
  const Building = data.map(rt => ({
      id: rt.building_id.toString(),  
      name: rt.building_name,
      buildingNumber: rt.building_number ?? '',
      totalFloors: rt.total_floors ?? 0,
  }));

  return <BuildingsClientPage initialBuilding={Building} />;
} 