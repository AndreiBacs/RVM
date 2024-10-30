<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRVMStore } from '../stores/rvmStore'
import { calculateDistance } from '../utils/distance'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import ProgressBar from 'primevue/progressbar'

const store = useRVMStore()

onMounted(async () => {
  if (!store.userLocation) {
    await store.getUserLocation()
  }
})

const getSeverity = (status: string) => {
  switch (status) {
    case 'operational':
      return 'success'
    case 'maintenance':
      return 'warning'
    case 'offline':
      return 'danger'
    default:
      return 'info'
  }
}

const machinesWithDistance = computed(() => {
  return store.sortedByDistance.map(machine => ({
    ...machine,
    distance: store.userLocation ? calculateDistance(
      store.userLocation.lat,
      store.userLocation.lng,
      machine.location.lat,
      machine.location.lng
    ) : null
  }))
})
</script>

<template>
  <div class="p-4">
    <DataTable 
      :value="machinesWithDistance" 
      :paginator="true" 
      :rows="10"
      :sortField="store.userLocation ? 'distance' : undefined"
      :sortOrder="1"
      responsive-layout="stack"
      class="shadow-sm rounded-lg"
      stripedRows
    >
      <Column field="address" header="Address" sortable></Column>
      <Column field="status" header="Status" sortable>
        <template #body="{ data }">
          <Tag :value="data.status" :severity="getSeverity(data.status)" />
        </template>
      </Column>
      <Column field="distance" header="Distance" sortable v-if="store.userLocation">
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <i class="pi pi-map-marker"></i>
            <span>{{ data.distance.toFixed(1) }} km</span>
          </div>
        </template>
      </Column>
      <Column field="lastMaintenance" header="Last Maintenance" sortable></Column>
      <Column field="currentFill" header="Fill Level" sortable>
        <template #body="{ data }">
          <div class="w-full">
            <ProgressBar 
              :value="Math.round((data.currentFill / data.capacity) * 100)"
              :pt:value:class="{
                'bg-green-400': data.currentFill / data.capacity < 0.7,
                'bg-yellow-400': data.currentFill / data.capacity >= 0.7 && data.currentFill / data.capacity < 0.9,
                'bg-red-400': data.currentFill / data.capacity >= 0.9
              }"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>