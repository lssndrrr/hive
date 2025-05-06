<template>
    <div
        :class="[
            'grid gap-6 p-4 md:p-6 h-screen w-screen overflow-hidden',
            isDetailsOpen ? 'grid-cols-[3fr_1fr]' : 'grid-cols-1', // Dynamic columns
        ]"
    >
        <div
            :class="[
                'flex flex-col w-[90%] space-y-8 overflow-y-auto main-content-scroll',
                !isDetailsOpen ? 'col-span-full' : '', // Takes full width if details are closed
            ]"
        >
            <div class="flex flex-row justify-between">
                <div>
                    <div class="flex items-center space-x-2 mb-1">
                        <h1 class="text-xl font-bold text-primary">
                            Hi, {{ userStore.user?.first_name }}!
                        </h1>
                        <Icon name="mdi:hand-wave" class="h-6 w-6 bg-primary" />
                    </div>
                    <p class="text-sm text-primary">
                        Hive five, {{ userStore.user?.first_name }}! Let's get
                        things done.
                    </p>
                </div>
                <Icon name="bxs:bell" class="bg-primary w-6 h-6" />
            </div>

            <div>
                <div class="flex justify-between items-center space-x-2 my-4">
                    <div class="flex items-center space-x-2">
                        <Icon
                            name="heroicons:check-circle-20-solid"
                            class="h-6 w-6 bg-[#A86523]"
                        />
                        <h2 class="text-lg font-semibold text-[#A86523]">
                            Your Tasks
                        </h2>
                    </div>
                    <div>
                        <UButton
                            color="neutral"
                            variant="solid"
                            icon="heroicons:plus-20-solid"
                            size="md"
                            class="text-[#A86523] hover:bg-[#E9A319] hover:text-white cursor:pointer"
                            @click="showAddTaskModal()"
                        >
                            Add Task
                        </UButton>
                    </div>
                </div>

                <div class="flex space-between space-x-4 pb-2">
                    <KanbanColumn
                        title="To Do"
                        :tasks="todoTasks"
                        @view-task-details="showTaskDetails"
                    />
                    <KanbanColumn
                        title="In Progress"
                        :tasks="inProgressTasks"
                        @view-task-details="showTaskDetails"
                    />
                    <KanbanColumn
                        title="Done"
                        :tasks="doneTasks"
                        @view-task-details="showTaskDetails"
                    />
                </div>
            </div>

            <div>
                <div class="flex items-center space-x-2 mb-4">
                    <Icon name="mdi:calendar" class="h-6 w-6 bg-[#A86523]" />
                    <h2 class="text-lg font-semibold text-[#A86523]">
                        Your Week
                    </h2>
                </div>
                <div class="w-full">
                    <Calendar
                        :task="allHiveTasks"
                        @view-task-details="showTaskDetails"
                    />
                </div>
            </div>
        </div>
    </div>

    <AddTaskModal
        :is-open="isAddTaskModalOpen"
        :members="memberOptions"
        @close="isAddTaskModalOpen = false"
        @submit="handleSubmit"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Task } from '~/types'
import { useUserStore } from '@/stores/user'
import { reactive } from 'vue'
import type { NewTask } from '@/interfaces/task'

const userStore = useUserStore()

const isDetailsOpen = ref(false)
const selectedTask = ref<Task | null>(null)
const isAddTaskModalOpen = ref(false)
const defaultNewTaskState = () => ({
    title: '',
    description: '',
    assignee: undefined as string | number | undefined,
    date: undefined as Date | undefined,
})

const newTask = reactive<NewTask>({
    name: '',
    description: '',
    assignee: null,
    date: undefined,
    status: 'TD',
    priority: 'M',
    hive: 1,
    created_by: userStore.user?.id ?? 0,
})

definePageMeta({
    layout: 'user',
    middleware: 'auth',
})

// const route = useRoute()
// const username = route.params.username; // Use this in the welcome message if needed

// --- Sample Data ---
const todoTasks = ref([
    {
        id: 't1',
        title: 'Design dashboard layout',
        date: '2025-05-03',
        hive: 'UI Team',
        assignee: { name: 'Alex', avatarUrl: null },
    },
    {
        id: 't2',
        title: 'Implement Kanban components',
        date: '2025-05-03',
        hive: 'Dev Team',
        assignee: {
            name: 'Ben',
            avatarUrl: 'https://avatars.githubusercontent.com/u/739984?v=4',
        },
    },
])
const inProgressTasks = ref([
    {
        id: 't3',
        title: 'Set up Nuxt project',
        date: '2025-04-30',
        hive: 'Dev Team',
        assignee: { name: 'Caleb' },
    },
])
const doneTasks = ref([
    {
        id: 't4',
        title: 'Gather requirements',
        date: '2025-05-01',
        hive: 'Product',
        assignee: { name: 'Sarah' },
    },
])
// --- End Sample Data ---

const allHiveTasks = computed(() => {
    return [...todoTasks.value, ...inProgressTasks.value, ...doneTasks.value]
})

function showTaskDetails(task: Task) {
    selectedTask.value = task
    isDetailsOpen.value = true
}

function showAddTaskModal() {
    console.log('Handling add task...')
    selectedTask.value = null
    isAddTaskModalOpen.value = true
}

function handleSubmit(taskPayload) {
    console.log('Submitted task:', taskPayload)
    isAddTaskModalOpen.value = false
}

function submitTask() {
    // Convert date to ISO string for API if needed
    const payload = {
        ...newTask,
        due_date: newTask.date?.toISOString().split('T')[0],
    }

    // Call your API/store action to save task
    console.log('Submitting new task:', payload)

    // Clear and close modal
    Object.assign(newTask, {
        name: '',
        description: '',
        assignee: null,
        date: undefined,
        status: 'TD',
        priority: 'M',
        hive: 1,
        created_by: userStore.user?.id ?? 0,
    })
    isAddTaskModalOpen.value = false
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
