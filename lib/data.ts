import usersData from '@/data/users.json';
import resourceTypesData from '@/data/resourceTypes.json';
import buildingsData from '@/data/buildings.json';
import resourcesData from '@/data/resources.json';
import facilitiesData from '@/data/facilities.json';
import bookingsData from '@/data/bookings.json';
import maintenanceData from '@/data/maintenance.json';
import cupboardsData from '@/data/cupboards.json';
import shelvesData from '@/data/shelves.json';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface ResourceType {
  id: string;
  name: string;
  description: string;
}

export interface Building {
  id: string;
  name: string;
  buildingNumber: string;
  totalFloors: number;
}

export interface Resource {
  id: string;
  name: string;
  resourceTypeId: string;
  buildingId: string;
  floorNumber: number;
  description: string;
}

export interface Facility {
  id: string;
  name: string;
  details: string;
  resourceId: string;
}

export interface Booking {
  id: string;
  resourceId: string;
  userId: string;
  startDateTime: string;
  endDateTime: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approverId: string | null;
  createdAt: string;
}

export interface Maintenance {
  id: string;
  resourceId: string;
  maintenanceType: string;
  scheduledDate: string;
  status: 'Scheduled' | 'In Progress' | 'Completed';
  notes: string;
}

export interface Cupboard {
  id: string;
  name: string;
  resourceLocation: string;
  totalShelves: number;
}

export interface Shelf {
  id: string;
  shelfNumber: number;
  capacity: number;
  description: string;
  cupboardId: string;
}

// Helper functions to get data
export function getUsers(): User[] {
  return usersData as User[];
}

export function getResourceTypes(): ResourceType[] {
  return resourceTypesData as ResourceType[];
}

export function getBuildings(): Building[] {
  return buildingsData as Building[];
}

export function getResources(): Resource[] {
  return resourcesData as Resource[];
}

export function getFacilities(): Facility[] {
  return facilitiesData as Facility[];
}

export function getBookings(): Booking[] {
  return bookingsData as Booking[];
}

export function getMaintenance(): Maintenance[] {
  return maintenanceData as Maintenance[];
}

export function getCupboards(): Cupboard[] {
  return cupboardsData as Cupboard[];
}

export function getShelves(): Shelf[] {
  return shelvesData as Shelf[];
}

// Helper functions to get related data
export function getUserById(id: string): User | undefined {
  return getUsers().find(u => u.id === id);
}

export function getResourceById(id: string): Resource | undefined {
  return getResources().find(r => r.id === id);
}

export function getResourceTypeById(id: string): ResourceType | undefined {
  return getResourceTypes().find(rt => rt.id === id);
}

export function getBuildingById(id: string): Building | undefined {
  return getBuildings().find(b => b.id === id);
}

export function getFacilitiesByResourceId(resourceId: string): Facility[] {
  return getFacilities().filter(f => f.resourceId === resourceId);
}

export function getCupboardById(id: string): Cupboard | undefined {
  return getCupboards().find(c => c.id === id);
}

export function getShelvesByCupboardId(cupboardId: string): Shelf[] {
  return getShelves().filter(s => s.cupboardId === cupboardId);
}
