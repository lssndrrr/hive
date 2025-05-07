<!-- <template>
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
                    <KanbanColumn
                        title="Overdue"
                        :tasks="overdueTasks"
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
        :created-by="userStore.user?.id || 0"
        @close="isAddTaskModalOpen = false"
        @submit="handleSubmit"
    />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useHiveTaskStore, useUserTaskStore } from '@/stores/task'
import { useHiveStore } from '~/stores/hive' // Correct path for hive store
import type { Task, NewTask } from '@/interfaces/task'
import type { HiveMember } from '@/interfaces/hive'

const userTaskStore = useUserTaskStore()
const hiveTaskStore = useHiveTaskStore()
const userStore = useUserStore()
const hiveStore = useHiveStore()

const hiveId = ref(1) // Example hiveId, you may update it dynamically
const isDetailsOpen = ref(false)
const selectedTask = ref<Task | null>(null)
const isAddTaskModalOpen = ref(false)

onMounted(async () => {
    console.log('USER ID ON MOUNT:', userStore.user?.id)
    if (userStore.user?.id) {
        await userTaskStore.fetchUserTasks(userStore.user?.id)
        console.log('Fetched tasks:', userTaskStore.tasks)
    }
})

const todoTasks = computed(() =>
    userTaskStore.tasks.filter((task) => task.status === 'TD')
)
const inProgressTasks = computed(() =>
    userTaskStore.tasks.filter((task) => task.status === 'IP')
)
const doneTasks = computed(() =>
    userTaskStore.tasks.filter((task) => task.status === 'D')
)
const overdueTasks = computed(() =>
    userTaskStore.tasks.filter((task) => task.status === 'OD')
)

const allHiveTasks = computed(() => userTaskStore.tasks)

// Get members from the hive
const memberOptions = computed(() => {
    return hiveStore
        .getMembers(hiveId.value)
        .filter((member: HiveMember) => member.id !== undefined)
        .map((member: HiveMember) => ({
            id: member.id, // Keep the id as is
            name: member.username, // Use `username` for `name`
        }))
})

// Methods
function showTaskDetails(task: Task) {
    selectedTask.value = task
    isDetailsOpen.value = true
}

function showAddTaskModal() {
    selectedTask.value = null
    isAddTaskModalOpen.value = true
}

async function handleSubmit(taskPayload: NewTask) {
    console.log('Submitting new task:', taskPayload)
    await hiveTaskStore.createHiveTask(taskPayload)
    await userTaskStore.fetchUserTasks(userStore.user?.id || 9)
    console.log('User Tasks after submit:', userTaskStore.tasks)
    isAddTaskModalOpen.value = false
}

definePageMeta({
    layout: 'user',
    middleware: 'auth',
})
</script>

<style scoped>
.main-content-scroll::-webkit-scrollbar {
    display: none;
}
.main-content-scroll {
    scrollbar-width: none;
    -ms-overflow-style: none;
}
</style> -->

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
                        :members="memberOptions"
                        @view-task-details="showTaskDetails"
                    />
                    <KanbanColumn
                        title="In Progress"
                        :tasks="inProgressTasks"
                        :members="memberOptions"
                        @view-task-details="showTaskDetails"
                    />
                    <KanbanColumn
                        title="Done"
                        :tasks="doneTasks"
                        :members="memberOptions"
                        @view-task-details="showTaskDetails"
                    />
                    <KanbanColumn
                        title="Overdue"
                        :tasks="overdueTasks"
                        :members="memberOptions"
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
        :created-by="userStore.user?.id || 0"
        @close="isAddTaskModalOpen = false"
        @submit="handleSubmit"
    />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useHiveTaskStore, useUserTaskStore } from '@/stores/task'
import { useHiveStore } from '~/stores/hive' // Correct path for hive store
import type { Task, NewTask } from '@/interfaces/task'
import type { HiveMember } from '@/interfaces/hive'

const userTaskStore = useUserTaskStore()
const hiveTaskStore = useHiveTaskStore()
const userStore = useUserStore()
const hiveStore = useHiveStore()

const hiveId = ref(1) // Example hiveId, you may update it dynamically
const isDetailsOpen = ref(false)
const selectedTask = ref<Task | null>(null)
const isAddTaskModalOpen = ref(false)

onMounted(async () => {
    console.log('USER ID ON MOUNT:', userStore.user?.id)
    if (userStore.user?.id) {
        await userTaskStore.fetchUserTasks()
        console.log('Fetched tasks:', userTaskStore.tasks)
    }
})

const todoTasks = computed(() =>
    userTaskStore.tasks.filter((task) => task.status === 'TD')
)
const inProgressTasks = computed(() =>
    userTaskStore.tasks.filter((task) => task.status === 'IP')
)
const doneTasks = computed(() =>
    userTaskStore.tasks.filter((task) => task.status === 'D')
)
const overdueTasks = computed(() =>
    userTaskStore.tasks.filter((task) => task.status === 'OD')
)

// Here we filter all tasks based on the hiveId
const allHiveTasks = computed(() => {
    return userTaskStore.fetchUserTasks()
})

// Get members from the hive
const memberOptions = computed(() => {
    return hiveStore
        .getMembers(hiveId.value)
        .filter((member: HiveMember) => member.id !== undefined)
        .map((member: HiveMember) => ({
            id: member.id,
            name: member.username, // You can keep username as the display name
            username: member.username,
            email: member.email,
            role: member.role,
            joined_on: member.joined_on, // Ensure this field is mapped correctly
        }))
})

// Methods
function showTaskDetails(task: Task) {
    selectedTask.value = task
    isDetailsOpen.value = true
}

function showAddTaskModal() {
    selectedTask.value = null
    isAddTaskModalOpen.value = true
}

async function handleSubmit(taskPayload: NewTask) {
    console.log('Submitting new task:', taskPayload)
    await hiveTaskStore.createHiveTask(taskPayload)
    // await userTaskStore.fetchUserTasks(userStore.user?.id || 10)
    console.log('User Tasks after submit:', userTaskStore.tasks)
    isAddTaskModalOpen.value = false
}

definePageMeta({
    layout: 'user',
    middleware: 'auth',
})
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
