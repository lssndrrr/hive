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

    <!-- Add Task Modal -->
    <div
        v-if="isAddTaskModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-gray-200/75 p-4"
        @click.self="isAddTaskModalOpen = false"
    >
        <UCard
            class="w-full max-w-md bg-[#FCEFCB] text-[#A86523]"
            @click.stop
            variant="soft"
        >
            <template #header>
                <div class="flex justify-between items-center">
                    <h2 class="text-lg font-semibold text-[#A86523]">
                        Add New Task
                    </h2>
                </div>
            </template>

            <div class="flex flex-col p-4 space-y-4">
                <UInput
                    v-model="newTask.name"
                    placeholder="Enter task name"
                    color="neutral"
                    class="w-full"
                />

                <UTextarea
                    v-model="newTask.description"
                    placeholder="Add details..."
                    color="neutral"
                    autoresize
                    class="w-full"
                />
                <div class="flex flex-row gap-2">
                    <USelectMenu
                        v-model="statusValue"
                        :items="status"
                        class="w-48"
                    />
                    <USelectMenu
                        v-model="prioValue"
                        :items="priority"
                        class="w-48"
                    />
                </div>
                <USelectMenu
                    v-model="newTask.assignee"
                    :items="memberOptions"
                    option-attribute="name"
                    value-attribute="id"
                    placeholder="Select member"
                    searchable
                    class="w-full"
                >
                    <template #label>
                        <span v-if="newTask.assignee">
                            {{ memberNameById(newTask.assignee) }}
                        </span>
                        <span v-else class="text-white/50">Select member</span>
                    </template>

                    <template #item="{ item }">
                        <span>{{ item.name }}</span>
                    </template>
                </USelectMenu>
                <UPopover :popper="{ placement: 'bottom-start' }">
                    <template #default="{ open }">
                        <UButton
                            color="secondary"
                            variant="solid"
                            icon="i-heroicons-calendar-days-20-solid"
                            size="sm"
                            class="w-full"
                            :label="
                                newTask.date
                                    ? format(newTask.date, 'MMM dd, yyyy')
                                    : 'Select Due Date'
                            "
                            @click="open"
                        />
                    </template>

                    <template #panel="{ close }">
                        <div class="p-2 bg-white rounded shadow">
                            <UCalendar
                                v-model="newTask.date"
                                @update:model-value="close()"
                            />
                            <div class="flex justify-end pt-2">
                                <UButton
                                    label="Clear"
                                    variant="ghost"
                                    color="neutral"
                                    size="xs"
                                    @click="
                                        () => {
                                            newTask.date = undefined
                                            close()
                                        }
                                    "
                                />
                            </div>
                        </div>
                    </template>
                </UPopover>
            </div>

            <template #footer>
                <div class="flex justify-end space-x-2">
                    <UButton
                        color="neutral"
                        variant="ghost"
                        class="text-[#A86523] hover:bg-transparent hover:text-white"
                        @click="isAddTaskModalOpen = false"
                    >
                        Cancel
                    </UButton>
                    <UButton
                        color="primary"
                        variant="solid"
                        class="text-white"
                        @click="submitTask"
                    >
                        Add Task
                    </UButton>
                </div>
            </template>
        </UCard>
    </div>
    <!-- add task modal end -->
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Task } from '~/types'
import { format } from 'date-fns'
import { useUserStore } from '@/stores/user'
import { reactive } from 'vue'
import type { NewTask } from '@/interfaces/task'
const userStore = useUserStore()

const status = ref(['Todo', 'In Progress', 'Done', 'Overdue'])
const statusValue = ref('Todo')
const priority = ref(['High', 'Medium', 'Low'])
const prioValue = ref('Medium')

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
})

const route = useRoute()
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
