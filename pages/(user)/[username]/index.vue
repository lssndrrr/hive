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
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useHiveTaskStore, useUserTaskStore } from '@/stores/task'
import { useHiveStore } from '~/stores/hive' // Correct path for hive store
import type { Task } from '@/interfaces/task'
import type { HiveMember } from '@/interfaces/hive'

const userTaskStore = useUserTaskStore()
const hiveTaskStore = useHiveTaskStore()
const userStore = useUserStore()
const hiveStore = useHiveStore()

const hiveId = ref(1)
const isDetailsOpen = ref(false)
const selectedTask = ref<Task | null>(null)

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

const allHiveTasks = computed(() => {
    return userTaskStore.fetchUserTasks()
})

function showTaskDetails(task: Task) {
    selectedTask.value = task
    isDetailsOpen.value = true
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
