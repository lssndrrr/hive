<template>
  <div 
    :class="[
      'grid gap-6 p-4 md:p-6 h-screen w-screen overflow-hidden',
      isDetailsOpen ? 'grid-cols-[3fr_1fr]' : 'grid-cols-1' // Dynamic columns
    ]"
  >
    <div 
        :class="[
          'flex flex-col space-y-8 overflow-y-auto main-content-scroll',
          !isDetailsOpen ? 'col-span-full' : '' // Takes full width if details are closed
        ]"
    >
      <div>
        <div class="flex items-center space-x-2 pt-8">
          <Icon name="material-symbols:hive-rounded" class="h-6 w-6 bg-[#A86523]" />
          <h1 class="text-xl font-bold text-[#A86523]">Hive Alpha</h1>
        </div>
      </div>

      <UTabs 
        :items="items" 
        class="w-[90%]" 
        variant="link"
      >
        <template #content="{ item }">

          <div v-if="item.label === 'Dashboard'" class="space-y-8">
            <div>
              <div class="flex justify-between items-center space-x-2 my-4">
                <div class="flex items-center space-x-2">
                  <Icon name="heroicons:check-circle-20-solid" class="h-6 w-6 text-[#A86523]" />
                  <h2 class="text-lg font-semibold text-[#A86523]">Hive Tasks</h2>
                </div>
                <div>
                  <UButton
                    color="neutral"
                    variant="solid"
                    icon="heroicons:plus-20-solid"
                    size="md"
                    class="text-[#A86523] hover:bg-[#E9A319] hover:text-white cursor:pointer"
                    @click="showTaskDetails({ id: 'new', title: 'New Task' })"
                  >
                    Add Task
                  </UButton>
                </div>
              </div>

              <div class="flex space-between space-x-4 pb-2">
                  <KanbanColumn title="To Do" :tasks="todoTasks" @view-task-details="showTaskDetails"/>
                  <KanbanColumn title="In Progress" :tasks="inProgressTasks" @view-task-details="showTaskDetails"/>
                  <KanbanColumn title="Done" :tasks="doneTasks" @view-task-details="showTaskDetails"/>
              </div>
            </div>

            <div>
              <div class="flex items-center space-x-2 mb-4">
                  <Icon name="mdi:calendar" class="h-6 w-6 text-[#A86523]" />
                  <h2 class="text-lg font-semibold text-[#A86523]">Hive Calendar</h2>
              </div>
              <div class="w-full">
                <Calendar
                  :tasks="allHiveTasks" @view-task-details="showTaskDetails"
                />
              </div>
            </div>
          </div>

          <div v-else-if="item.label === 'Members'">
            <h2 class="text-lg font-semibold text-[#A86523] mb-4">Hive Members</h2>
            <div class="p-8">
              <MembersTab :members="hiveMembers" @add-member-clicked="handleAddNewMember"/>
            </div>
          </div>

          <div v-else-if="item.label === 'Tasks'">
            <h2 class="text-lg font-semibold text-[#A86523] mb-4">Tasks Overview</h2>
            <p class="text-[#A86523]">Placeholder content for a dedicated tasks view.</p>
          </div>
          
        </template>
      </UTabs>
    </div>

    <div>
      <HiveSlideover @close="isDetailsOpen = false"></HiveSlideover>
    </div>
    <div class="h-full overflow-hidden">
      <TaskDetails v-model="isDetailsOpen" v-if="isDetailsOpen && selectedTask" :task="selectedTask" @close="isDetailsOpen = false"></TaskDetails>
    </div>

  </div>
  
  <!-- Add New Member Modal -->
  <div
    v-if="isAddMemberModalOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-gray-200/75 dark:bg-gray-800/75 p-4"
    @click.self="isAddMemberModalOpen = false" 
  >
    <UCard
      class="w-full max-w-md"
      @click.stop 
    >
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold text-[#A86523]">Add New Member</h2>
        </div>
      </template>

      <div class="p-4">
        <p class="text-[#A86523]">Form elements to add a new member will go here.</p>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-2">
          <UButton color="neutral" variant="ghost" class="text-[#A86523] hover:bg-transparent hover:text-white " @click="isAddMemberModalOpen = false">Cancel</UButton>
          <UButton color="primary" variant="solid" class="text-white" @click="submitNewMember">Add Member</UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Task } from '~/types';
import type { TabsItem } from '@nuxt/ui'

const isDetailsOpen = ref(false);
const isAddMemberModalOpen = ref(false);
const selectedTask = ref<Task | null>(null); 

const items = ref<TabsItem[]>([
  { label: 'Dashboard', icon: 'i-lucide-layout-dashboard' },
  { label: 'Members', icon: 'i-lucide-users' },
  { label: 'Tasks', icon: 'i-lucide-check-square' },
]);

definePageMeta({
  layout: 'user'
});

const route = useRoute();

// --- Sample Data ---
const todoTasks = ref([
  { id: 't1', title: 'Design dashboard layout', date: '2025-11-17', hive: 'UI Team', assignee: { name: 'Alex', avatarUrl: null } },
  { id: 't2', title: 'Implement Kanban components', date: '2025-11-18', hive: 'Dev Team', assignee: { name: 'Ben', avatarUrl: 'https://avatars.githubusercontent.com/u/739984?v=4' } },
]);
const inProgressTasks = ref([
  { id: 't3', title: 'Set up Nuxt project', date: '2025-11-15', hive: 'Dev Team', assignee: { name: 'Caleb' } },
]);
const doneTasks = ref([
   { id: 't4', title: 'Gather requirements', date: '2025-11-10', hive: 'Product', assignee: { name: 'Sarah' } },
]);

const allHiveTasks = computed(() => {
  return [...todoTasks.value, ...inProgressTasks.value, ...doneTasks.value];
});

const hiveMembers = ref([
  { id: 'm1', name: 'Drone 1', avatarUrl: null },
  { id: 'm2', name: 'Drone 2', avatarUrl: null },
  { id: 'm3', name: 'Drone 3', avatarUrl: null },
  { id: 'm4', name: 'Drone 4', avatarUrl: null },
  { id: 'm5', name: 'Drone 5', avatarUrl: null },
]);
// --- End Sample Data ---

function showTaskDetails(task: Task) {
  selectedTask.value = task;
  isDetailsOpen.value = true;
}

function handleAddNewMember() {
  console.log('Handling add new member...');
  isAddMemberModalOpen.value = true;
}

function submitNewMember() {
  console.log('Submitting new member...');
  // Add logic here to gather form data and send it to your backend/API
  isAddMemberModalOpen.value = false;
}

</script>

<style scoped>
.main-content-scroll::-webkit-scrollbar {
  display: none; 
}
.main-content-scroll {
  scrollbar-width: none; 
  -ms-overflow-style: none; 
}

</style>