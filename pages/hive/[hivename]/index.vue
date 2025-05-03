<template>
  <div 
    :class="[
      'grid gap-6 p-4 md:p-6 h-screen w-screen overflow-hidden',
      isTaskDetailsOpen || isMemberDetailsOpen ? 'grid-cols-[3fr_1fr]' : 'grid-cols-1' // Dynamic columns
    ]"
  >
    <div 
        :class="[
          'flex flex-col space-y-8 overflow-y-auto main-content-scroll',
          !isTaskDetailsOpen && !isMemberDetailsOpen ? 'col-span-full' : '' // Takes full width if details are closed
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
            <div class="flex items-center space-x-2 my-4">
              <Icon name="icon-park-solid:bee" class="h-6 w-6 text-[#A86523]" />
              <h2 class="text-lg font-semibold text-[#A86523]">Hive Members</h2>
            </div>
            <div class="p-8">
              <MembersTab :members="hiveMembers" @add-member-clicked="handleAddNewMember" @view-member-details="showMemberDetails"/>
            </div>
          </div>

          <div v-else-if="item.label === 'Tasks'">
            <div class="flex items-center space-x-2 my-4">
              <Icon name="solar:checklist-minimalistic-bold" class="h-6 w-6 text-[#A86523]" />
              <h2 class="text-lg font-semibold text-[#A86523]">Hive Task Overview</h2>
            </div>
            <div class="p-8">
              <TasksTab
                :todo-tasks="todoTasks"
                :in-progress-tasks="inProgressTasks"
                :done-tasks="doneTasks"
                @view-task-details="showTaskDetails"
                @add-task="handleAddTask"
              />
            </div>
          </div>
          
        </template>
      </UTabs>
    </div>

    <div class="h-full overflow-hidden">
      <MemberDetails v-model="isMemberDetailsOpen" v-if="isMemberDetailsOpen && selectedMember" :member="selectedMember" @close="isMemberDetailsOpen = false"></MemberDetails>
    </div>
    <div class="h-full overflow-hidden">
      <TaskDetails v-model="isTaskDetailsOpen" v-if="isTaskDetailsOpen && selectedTask" :task="selectedTask" @close="isTaskDetailsOpen = false" @update-status="handleUpdateTaskStatus" @update-date="handleUpdateTaskDate" class="details-panel"></TaskDetails>
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
import type { Member, Task } from '~/types';
import type { TabsItem } from '@nuxt/ui'

const isTaskDetailsOpen = ref(false);
const isMemberDetailsOpen = ref(false);
const isAddMemberModalOpen = ref(false);
const selectedTask = ref<Task | null>(null); 
const selectedMember = ref<Member | null>(null); 

const items = ref<TabsItem[]>([
  { label: 'Dashboard', icon: 'mdi:beehive-outline' },
  { label: 'Members', icon: 'icon-park-solid:bee' },
  { label: 'Tasks', icon: 'i-lucide-check-square' },
]);

definePageMeta({
  layout: 'hive'
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
  isTaskDetailsOpen.value = true;
}

function showMemberDetails(member: any) {
  selectedMember.value = member;
  isMemberDetailsOpen.value = true;
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

function handleUpdateTaskStatus({ taskId, status }: { taskId: string | number, status: string }) {
  console.log(`Updating task ${taskId} to status ${status}`);

  // Find the task and move it between the status arrays
  let taskToMove: Task | undefined;
  let sourceArray: Ref<Task[]> | undefined;
  let targetArray: Ref<Task[]> | undefined;

  // Find in todoTasks
  const todoIndex = todoTasks.value.findIndex(t => t.id === taskId);
  if (todoIndex !== -1) {
    taskToMove = todoTasks.value[todoIndex];
    sourceArray = todoTasks;
  }

  // Find in inProgressTasks
  if (!taskToMove) {
    const progressIndex = inProgressTasks.value.findIndex(t => t.id === taskId);
    if (progressIndex !== -1) {
      taskToMove = inProgressTasks.value[progressIndex];
      sourceArray = inProgressTasks;
    }
  }

  // Find in doneTasks
  if (!taskToMove) {
    const doneIndex = doneTasks.value.findIndex(t => t.id === taskId);
    if (doneIndex !== -1) {
      taskToMove = doneTasks.value[doneIndex];
      sourceArray = doneTasks;
    }
  }

  // Determine target array based on new status
  if (status === 'todo') targetArray = todoTasks;
  else if (status === 'inprogress') targetArray = inProgressTasks;
  else if (status === 'done') targetArray = doneTasks;

  // Move the task if found and source/target are valid
  if (taskToMove && sourceArray && targetArray && sourceArray !== targetArray) {
      // Update the task's status property (important!)
      taskToMove.status = status;

      // Remove from source array
      sourceArray.value = sourceArray.value.filter(t => t.id !== taskId);

      // Add to target array
      targetArray.value.push(taskToMove);

      // Optional: Update the selectedTask ref if it's the one being moved
      // This ensures the details panel shows the updated status immediately
      // if the status change didn't come from the panel itself (e.g., drag-and-drop)
      if (selectedTask.value && selectedTask.value.id === taskId) {
          selectedTask.value.status = status;
      }

  } else if (taskToMove) {
      // Task found, but status didn't change column OR target is invalid
      // Still update the status property on the original object
       taskToMove.status = status;
       // Force reactivity update if needed (usually not necessary with ref arrays)
       // sourceArray.value = [...sourceArray.value];
       if (selectedTask.value && selectedTask.value.id === taskId) {
          selectedTask.value.status = status;
       }
  } else {
      console.warn(`Task with ID ${taskId} not found in any list.`);
  }
}

function handleUpdateTaskDate({ taskId, date }: { taskId: string | number, date: string | null }) {
    console.log(`Updating task ${taskId} date to: ${date}`);

    // Find the task in one of the arrays
    const taskRefs = [todoTasks, inProgressTasks, doneTasks];
    let taskFound = false;
    for (const taskRef of taskRefs) {
        const task = taskRef.value.find(t => t.id === taskId);
        if (task) {
            task.date = date ?? undefined; // Update the date (use undefined if date is null)
             // Update selected task if it's the one being edited
            if (selectedTask.value?.id === taskId) {
                selectedTask.value = { ...selectedTask.value, date: date ?? undefined };
            }
            taskFound = true;
            break;
        }
    }

    if (taskFound) {
        // TODO: Add API call here to update the task date in your backend
        // Example: await $fetch('/api/tasks/updateDate', { method: 'POST', body: { taskId, date } });
        console.log('API call placeholder: Update date in backend');
    } else {
        console.warn(`Task with ID ${taskId} not found for date update.`);
    }
}
</script>