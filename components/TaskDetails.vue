<template>
    <aside
        class="w-[25%] h-full bg-[#FCEFCB] fixed top-0 right-0 flex flex-col"
        @click.stop
    >
        <!-- Status and Close Header -->
        <div
            class="flex border-b border-primary bg-[#FCEFCB] text-primary items-center justify-between px-6 py-2"
            style="font-family: 'Nexa'; font-weight: 800"
        >
            <h1
                style="font-family: 'Nexa'; font-weight: 800; font-size: 1.4rem"
                class=""
            >
                Edit Task
            </h1>
            <UButton
                icon="mingcute:close-fill"
                color="neutral"
                variant="link"
                size="sm"
                class="text-[#A86523] hover:text-[#E9A319]"
                @click="closePanel"
                aria-label="Close panel"
            />
        </div>

        <!-- Main Content -->
        <div class="w-100 flex-grow overflow-y-auto px-10 py-15 text-primary">
            <div class="flex flex-col gap-4">
                <div>
                    <p style="font-family: 'Nexa'; font-weight: 800">Title</p>
                    <UInput
                        v-model="editedTaskName"
                        placeholder="Task Name"
                        color="info"
                        variant="solid"
                        size="md"
                        class="rounded-md w-full font-semibold bg-info text-primary border-secondary"
                        style="font-family: 'Nexa'; font-weight: 200"
                        :ui="{ base: 'bg-white' }"
                    />
                </div>
                <div>
                    <p style="font-family: 'Nexa'; font-weight: 800">
                        Description
                    </p>
                    <UInput
                        v-model="editedTaskDescription"
                        placeholder="Task Description"
                        color="info"
                        variant="solid"
                        size="md"
                        class="rounded-md w-full font-semibold bg-info text-primary border-secondary"
                        style="font-family: 'Nexa'; font-weight: 200"
                        :ui="{ base: 'bg-white' }"
                    />
                </div>
                <div>
                    <p style="font-family: 'Nexa'; font-weight: 800">Status</p>
                    <USelect
                        v-model="currentStatus"
                        :items="statusOptions"
                        option-attribute="label"
                        value-attribute="value"
                        placeholder="Select Status"
                        color="solid"
                        variant="solid"
                        size="md"
                        class="w-full font-semibold bg-info text-primary border-secondary"
                        style="font-family: 'Nexa'; font-weight: 200"
                        :ui="{ base: 'bg-white' }"
                    />
                </div>
                <div>
                    <p style="font-family: 'Nexa'; font-weight: 800">
                        Priority
                    </p>
                    <USelect
                        v-model="currentPriority"
                        :items="priorityOptions"
                        option-attribute="label"
                        value-attribute="value"
                        placeholder="Select Priority"
                        color="solid"
                        variant="solid"
                        size="md"
                        class="w-full font-semibold bg-info text-primary border-secondary"
                        style="font-family: 'Nexa'; font-weight: 200"
                        :ui="{ base: 'bg-white' }"
                    />
                </div>
                <div>
                    <p style="font-family: 'Nexa'; font-weight: 800">
                        Assign Member
                    </p>
                    <USelect
                        v-model="assignedMember"
                        :items="membersOptions"
                        option-attribute="label"
                        value-attribute="value"
                        placeholder="Assign Member"
                        color="primary"
                        variant="solid"
                        size="md"
                        class="w-full font-semibold bg-info text-primary border-secondary"
                        style="font-family: 'Nexa'; font-weight: 200"
                        :ui="{ base: 'bg-white' }"
                    />
                </div>
                <div>
                    <p style="font-family: 'Nexa'; font-weight: 800">
                        Due Date
                    </p>
                    <UPopover>
                        <UButton
                            color="secondary"
                            variant="solid"
                            icon="i-heroicons-calendar"
                            class="w-full font-semibold bg-info text-primary border-secondary"
                            style="font-family: 'Nexa'; font-weight: 200"
                            :ui="{ base: 'bg-white' }"
                        >
                            {{
                                modelValue
                                    ? df.format(
                                          modelValue.toDate(getLocalTimeZone())
                                      )
                                    : 'Select a date'
                            }}
                        </UButton>
                        <template #content>
                            <UCalendar v-model="modelValue" class="p-2" />
                        </template>
                    </UPopover>
                </div>
            </div>
        </div>

        <!-- Delete Button -->
        <div class="flex px-8 py-4 justify-between items-center space-x-4">
            <UButton
                label="Save Changes"
                color="primary"
                variant="solid"
                icon="material-symbols:save-outline-rounded"
                size="sm"
                class="text-white w-full justify-center cursor-pointer"
                @click="saveTaskChanges"
                style="font-family: 'Nexa'; font-weight: 800"
            />
            <UButton
                label="Delete Task"
                color="secondary"
                variant="solid"
                icon="material-symbols:delete-outline-rounded"
                size="sm"
                class="text-white w-full justify-center cursor-pointer"
                @click="deleteTask"
                style="font-family: 'Nexa'; font-weight: 800"
            />
        </div>
    </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Task, AddTaskPayload, Status, Priority } from '~/interfaces/task'
import { useHiveStore } from '~/stores/hive'

import {
    CalendarDate,
    DateFormatter,
    getLocalTimeZone,
} from '@internationalized/date'

const props = defineProps({
    task: {
        type: Object as PropType<Task>,
        required: true,
    },
})

const df = new DateFormatter('en-US', {
    dateStyle: 'medium',
})

const modelValue = shallowRef<CalendarDate | null>(null)
const editedTaskName = ref(props.task.name)
const editedTaskDescription = ref(props.task.description)
const hiveStore = useHiveStore()
const isConfirmDeleteModalOpen = ref(false)

const emit = defineEmits([
    'close',
    'update-status',
    'update-title',
    'update-description',
    'update-date',
    'assign-user',
    'delete-task',
])

const statusOptions = [
    { label: 'To Do', value: 'TD' },
    { label: 'In Progress', value: 'IP' },
    { label: 'Done', value: 'D' },
    { label: 'Overdue', value: 'OD' },
] as const

const priorityOptions = [
    { label: 'Low', value: 'L' },
    { label: 'Medium', value: 'M' },
    { label: 'High', value: 'H' },
] as const

const currentStatus = ref<Status>(props.task.status)
const currentPriority = ref<Priority>(props.task.priority)
const assignedMember = ref<number | null>(props.task.assignee ?? null)

const membersOptions = ref<{ label: string; value: number | null }[]>([])

onMounted(() => {
    if (props.task.due_date) {
        const date = new Date(props.task.due_date)
        modelValue.value = new CalendarDate(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate()
        )
    }

    const hiveId = props.task.hive
    const members = hiveStore.getMembers(hiveId)
    console.log('Members from hiveStore:', members)

    membersOptions.value = [
        { label: 'Unassigned', value: null },
        ...members.map((member) => ({
            label: member.user.username,
            value: member.user.id,
        })),
    ]

    console.log('Mapped member options:', membersOptions.value)
})

function closePanel() {
    emit('close')
}

async function deleteTask() {
    isConfirmDeleteModalOpen.value = true
    const confirmed = confirm('Are you sure you want to delete this task?')
    if (!confirmed) return

    const response = await hiveStore.deleteTask(props.task.id, props.task.hive)
    if (response?.success) {
        emit('delete-task', props.task.id)
        emit('close')
    } else {
        alert('Failed to delete task: ' + response?.message)
    }
}

async function saveTaskChanges() {
    const payload: Partial<AddTaskPayload> = {}

    if (currentStatus.value !== props.task.status) {
        payload.status = currentStatus.value
    }

    if (currentPriority.value !== props.task.priority) {
        payload.priority = currentPriority.value
    }

    if (assignedMember.value !== props.task.assignee) {
        payload.assignee = assignedMember.value
    }

    if (modelValue.value) {
        payload.due_date = modelValue.value.toString()
    }

    if (editedTaskName.value !== props.task.name) {
        payload.name = editedTaskName.value
    }

    if (editedTaskDescription.value !== props.task.description) {
        payload.description = editedTaskDescription.value
    }

    if (Object.keys(payload).length === 0) {
        alert('No changes to save.')
        return
    }

    const response = await hiveStore.updateTask(props.task.id, payload)

    if (response?.success) {
        alert('Task updated successfully!')
        emit('close')
    } else {
        alert('Failed to update task!')
    }
}
</script>
