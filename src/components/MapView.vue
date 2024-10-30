<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { LMap, LTileLayer, LMarker, LPopup, LCircle } from '@vue-leaflet/vue-leaflet'
import { useRVMStore } from '../stores/rvmStore'
import { calculateDistance } from '../utils/distance'
import { PointTuple } from 'leaflet';

const store = useRVMStore()
const zoom = ref(13)
const center = ref([46.7712, 23.6236] as PointTuple) // Centered on Cluj-Napoca

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
            <p class="text-sm">Status: {{ machine.status }}</p>
            <p v-if="store.userLocation" class="text-sm">
              Distance: {{ 
                calculateDistance(
                  store.userLocation.lat,
                  store.userLocation.lng,
                  machine.location.lat,
                  machine.location.lng
                ).toFixed(1) 
              }} km
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