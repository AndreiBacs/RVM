import { defineStore } from 'pinia'
import type { RVM } from '../types/RVM'
import { calculateDistance } from '../utils/distance'

export const useRVMStore = defineStore('rvm', {
  state: () => ({
    machines: [] as RVM[],
    selectedMachine: null as RVM | null,
    userLocation: null as { lat: number; lng: number } | null,
  }),
  
  getters: {
    sortedByDistance: (state) => {
      if (!state.userLocation) return state.machines;
      
      return [...state.machines].sort((a, b) => {
        const distA = calculateDistance(
          state.userLocation!.lat,
          state.userLocation!.lng,
          a.location.lat,
          a.location.lng
        );
        const distB = calculateDistance(
          state.userLocation!.lat,
          state.userLocation!.lng,
          b.location.lat,
          b.location.lng
        );
        return distA - distB;
      });
    }
  },
  
  actions: {
    async fetchMachines() {
      // Simulated data - replace with actual API call
      this.machines = [
        {
          id: '1',
          location: { lat: 46.7712, lng: 23.6236 },
          address: 'Iulius Mall Cluj, Str. Alexandru Vaida Voevod 53B',
          status: 'operational',
          lastMaintenance: '2024-03-15',
          capacity: 1000,
          currentFill: 456
        },
        {
          id: '2',
          location: { lat: 46.7674, lng: 23.6200 },
          address: 'VIVO! Cluj-Napoca, Str. Avram Iancu 492-500',
          status: 'maintenance',
          lastMaintenance: '2024-03-10',
          capacity: 1000,
          currentFill: 879
        },
        {
          id: '3',
          location: { lat: 46.7697, lng: 23.5885 },
          address: 'Kaufland Cluj-Napoca Mănăștur',
          status: 'operational',
          lastMaintenance: '2024-03-14',
          capacity: 1000,
          currentFill: 234
        },
        {
          id: '4',
          location: { lat: 46.7783, lng: 23.6066 },
          address: 'Carrefour Market Piața Mihai Viteazu',
          status: 'operational',
          lastMaintenance: '2024-03-16',
          capacity: 1000,
          currentFill: 567
        },
        {
          id: '5',
          location: { lat: 46.7516, lng: 23.5982 },
          address: 'Lidl Cluj-Napoca Sud, Calea Florești',
          status: 'maintenance',
          lastMaintenance: '2024-03-12',
          capacity: 1000,
          currentFill: 950
        }
      ] as RVM[]
    },
    
    setSelectedMachine(machine: RVM | null) {
      this.selectedMachine = machine
    },

    async getUserLocation() {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        this.userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      } catch (error) {
        console.error('Error getting user location:', error);
      }
    }
  }
})