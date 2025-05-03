<template>
    
  <div 
      :class="[
        'grid gap-6 p-4 md:p-6 h-screen w-screen overflow-hidden',
        isDetailsOpen ? 'grid-cols-[3fr_1fr]' : 'grid-cols-1' // Dynamic columns
      ]"
  >
      <div 
          :class="[
            'flex flex-col w-[90%] space-y-8 overflow-y-auto main-content-scroll',
            !isDetailsOpen ? 'col-span-full' : '' // Takes full width if details are closed
          ]"
      >
        <div>
          <div class="flex items-center space-x-2 mb-1">
            <h1 class="text-xl font-bold text-[#A86523]">Hi, Caleb Josh!</h1>
            <Icon name="mdi:hand-wave" class="h-6 w-6 bg-[#A86523]" />
          </div>
          <p class="text-sm text-[#A86523]">Hive five, Caleb! Let's get things done.</p>
        </div>

        <div>
          <div class="flex justify-between items-center space-x-2 my-4">
            <div class="flex items-center space-x-2">
              <Icon name="heroicons:check-circle-20-solid" class="h-6 w-6 bg-[#A86523]" />
              <h2 class="text-lg font-semibold text-[#A86523]">Your Tasks</h2>

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
            <Icon name="mdi:calendar" class="h-6 w-6 bg-[#A86523]" />
            <h2 class="text-lg font-semibold text-[#A86523]">Your Week</h2>
          </div>
          <div class="w-full">
            <Calendar
              :tasks="allHiveTasks" @view-task-details="showTaskDetails"
            />
          </div>

        </div>
      </div>

      <div class="h-full overflow-hidden">
        <TaskDetails v-model="isDetailsOpen" v-if="isDetailsOpen && selectedTask" :task="selectedTask" @close="isDetailsOpen = false"></TaskDetails>
      </div>
  </div>
      
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Task } from '~/types';

const isDetailsOpen = ref(false);
const selectedTask = ref<Task | null>(null); 

definePageMeta({
  layout: 'user'
});

const route = useRoute();
// const username = route.params.username; // Use this in the welcome message if needed

// --- Sample Data ---
const todoTasks = ref([
  { id: 't1', title: 'Design dashboard layout', date: '2025-05-03', hive: 'UI Team', assignee: { name: 'Alex', avatarUrl: null } },
  { id: 't2', title: 'Implement Kanban components', date: '2025-05-03', hive: 'Dev Team', assignee: { name: 'Ben', avatarUrl: 'https://avatars.githubusercontent.com/u/739984?v=4' } },
]);
const inProgressTasks = ref([
  { id: 't3', title: 'Set up Nuxt project', date: '2025-04-30', hive: 'Dev Team', assignee: { name: 'Caleb' } },
]);
const doneTasks = ref([
   { id: 't4', title: 'Gather requirements', date: '2025-05-01', hive: 'Product', assignee: { name: 'Sarah' } },
]);
// --- End Sample Data ---

const allHiveTasks = computed(() => {
  return [...todoTasks.value, ...inProgressTasks.value, ...doneTasks.value];
});

function showTaskDetails(task: Task) {
  selectedTask.value = task;
  isDetailsOpen.value = true;
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
