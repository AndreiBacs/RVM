<script setup lang="ts">
import { ref } from 'vue'
import MapView from './components/MapView.vue'
import MachineList from './components/MachineList.vue'
import ToggleButton from "primevue/togglebutton"

const showMap = ref(true)

</script>

<template>
  <div class="h-screen flex flex-col">
    <header class="bg-white shadow p-4">
      <div class="flex justify-between items-center">
        <h1 class="text-xl font-bold">RetuRO RVM</h1>
        <ToggleButton  v-model="showMap" onLabel="Show List" offLabel="Show Map" onIcon="pi pi-list" offIcon="pi pi-map"/>
      </div>
    </header>

    <main class="flex-1 relative">
      <Transition name="fade" mode="out-in">
        <MapView v-if="showMap" class="h-full" />
        <MachineList v-else />
      </Transition>
    </main>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>