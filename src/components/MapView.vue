<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { LMap, LTileLayer, LMarker, LPopup, LCircle } from '@vue-leaflet/vue-leaflet'
import { useRVMStore } from '../stores/rvmStore'
import { calculateDistance } from '../utils/distance'
import { getSeverity} from '../utils/statusSeverity'
import { PointTuple } from 'leaflet';
import Button from 'primevue/button';
import Tag from 'primevue/tag';

const store = useRVMStore()
const zoom = ref(13)
const center = ref([46.7712, 23.6236] as PointTuple) // Centered on Cluj-Napoca


const navigate =()=>{
  const googleMapsUrl = `https://www.google.com/maps?q=${store.selectedMachine?.location.lat},${store.selectedMachine?.location.lng}`;
      // Open the URL in a new tab
  window.open(googleMapsUrl, '_blank');
}

onMounted(async () => {
  await store.fetchMachines()
  await store.getUserLocation()
  if (store.userLocation) {
    center.value = [store.userLocation.lat, store.userLocation.lng]
  }
})

</script>

<template>
  <div class="h-full w-full">
    <l-map ref="map" v-model:zoom="zoom" v-model:center="center" class="h-full">
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      />
      <l-marker
        v-for="machine in store.machines"
        :key="machine.id"
        :lat-lng="[machine.location.lat, machine.location.lng]"
        @click="store.setSelectedMachine(machine)"
      >
        <l-popup>
          <div class="p-2">
            <h3 class="font-bold">{{ machine.address }}</h3>
            <p class="text-sm">Status: 
              <Tag :value="machine.status" :severity="getSeverity(machine.status)" />
            </p>

            <p v-if="store.userLocation" class="text-sm">
              Distance: {{ 
                calculateDistance(
                  store.userLocation.lat,
                  store.userLocation.lng,
                  machine.location.lat,
                  machine.location.lng
                ).toFixed(1) 
              }} km
              <Button icon="pi pi-directions" aria-label="Navigate" @click="navigate()" />
            </p>

          </div>
        </l-popup>
      </l-marker>
      <l-circle
        v-if="store.userLocation"
        :lat-lng="[store.userLocation.lat, store.userLocation.lng]"
        :radius="100"
        color="blue"
        fill
      />
    </l-map>
  </div>
</template>

<style scoped>
.leaflet-container {
  height: 100%;
  width: 100%;
}
</style>