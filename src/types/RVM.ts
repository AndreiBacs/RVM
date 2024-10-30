export interface RVM {
  id: string;
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  status: 'operational' | 'maintenance' | 'offline';
  lastMaintenance: string;
  capacity: number;
  currentFill: number;
}