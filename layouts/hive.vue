<template>

   <div class="flex h-screen overflow-hidden">
  
    <Sidebar />
  
    <HiveSlideover
      :isOpen="isHivePanelOpen"
      :hives="hivesFromStore" 
      @close="isHivePanelOpen = false"
      @add-hive="openAddHiveModal"
    />
      <main
      :class="[
      'flex-1 transition-padding duration-300 ease-in-out', // Allow main content to scroll
      isHivePanelOpen ? 'pl-24' : 'pl-24' // Dynamic padding left based on panel state
      ]"
      >
        <button
          @click="isHivePanelOpen = !isHivePanelOpen"
          :class="[
            'fixed top-3 p-1 bg-[#A86523] text-white rounded shadow transition-all duration-300 ease-in-out',
            isHivePanelOpen ? 'left-58' : 'left-20' // Dynamic left position
          ]"
          title="Toggle Hive Panel"
          size="xs"
        >
          <Icon :name="isHivePanelOpen ? 'i-heroicons-chevron-double-left-20-solid' : 'i-heroicons-chevron-double-right-20-solid'" />
        </button>
      <slot></slot>
    </main>
   </div>
</template>
  
  
  
<script setup lang="ts">

import { ref, computed, onMounted } from 'vue';
import { useHiveStore } from '~/stores/hive'; 
import type { Hive } from '~/interfaces/hive';

const hiveStore = useHiveStore();

const isHivePanelOpen = ref(false); // Panel visibility state
const isAddHiveModalOpen = ref(false); // Modal visibility state

const hivesFromStore = computed(() => hiveStore.hives);

onMounted(() => {
  // Fetch hives only if the store doesn't already have them
  if (hiveStore.hives.length === 0) {
    console.log('Layout mounted, fetching user hives...');
    hiveStore.fetchUserHives();
  }
});

function openAddHiveModal() {
  console.log('Open add hive modal');
  isAddHiveModalOpen.value = true;
}

</script>