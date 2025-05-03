<template>

   <div class="flex h-screen overflow-hidden">
  
    <Sidebar />
  
    <HiveSlideover
     :isOpen="isHivePanelOpen"
     :hives="userHives"
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
        'fixed top-3 z-[60] p-1 bg-[#A86523] text-white rounded shadow transition-all duration-300 ease-in-out',
        isHivePanelOpen ? 'left-58' : 'left-20' // Dynamic left position
      ]"
      title="Toggle Hive Panel"
      size="xs"
    >
      <Icon :name="isHivePanelOpen ? 'i-heroicons-chevron-double-left-20-solid' : 'i-heroicons-chevron-double-right-20-solid'" />
    </button>
  
    <slot></slot>
    </main>

    <UModal v-model="isAddHiveModalOpen">
      <UCard>
      <template #header>Add New Hive</template>
        Placeholder for Add Hive Form
      <template #footer>
        <UButton @click="isAddHiveModalOpen = false">Close</UButton>
      </template>
      </UCard>
    </UModal>
   </div>
</template>
  
  
  
  <script setup lang="ts">
  
  import { ref } from 'vue';
  
  
  
  interface Hive { id: string | number; name: string; slug?: string; isActive?: boolean; }
  
  
  
  // State for the hive panel visibility - LIVES IN THE LAYOUT
  
  const isHivePanelOpen = ref(false); // Start closed
  
  
  
  // State for the Add Hive modal
  
  const isAddHiveModalOpen = ref(false);
  
  
  
  // --- Sample Hive Data ---
  
  // This data should ideally come from a store or API call accessible by the layout
  
  const userHives = ref<Hive[]>([
  
   { id: 'h1', name: 'Hive Alpha', slug: 'hive-alpha', isActive: true },
  
   { id: 'h2', name: 'Project Beta', slug: 'project-beta' },
  
   { id: 'h3', name: 'Research Gamma', slug: 'research-gamma' },
  
  ]);
  
  // --- End Sample Hive Data ---
  
  
  
  // Method to open the Add Hive modal
  
  function openAddHiveModal() {
  
   console.log('Open add hive modal');
  
   isAddHiveModalOpen.value = true;
  
  }
  
  
  
  </script>