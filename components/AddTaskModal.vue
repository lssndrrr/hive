<template>
    <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="close"
    >
        <UCard class="w-full max-w-md bg-primary" @click.stop variant="outline">
            <template #header>
                <div class="flex justify-center items-center">
                    <h2 class="text-lg font-semibold text-info">
                        Add New Task
                    </h2>
                </div>
            </template>

            <div class="flex flex-col p-4 space-y-4">
                <UInput
                    v-model="task.name"
                    placeholder="Enter task name"
                    color="primary"
                    class="w-full text-info"
                />
                <UTextarea
                    v-model="task.description"
                    placeholder="Add task description..."
                    color="primary"
                    autoresize
                    class="w-full text-info"
                />

                <div class="flex flex-row gap-2">
                    <!-- Status Select -->
                    <USelectMenu
                        v-model="status"
                        :items="statusOptions"
                        value-attribute="id"
                        option-attribute="name"
                        class="w-48"
                    >
                        <template #default>
                            <span
                                :class="status ? 'text-white' : 'text-gray-400'"
                            >
                                {{ status?.name || 'Select status' }}
                            </span>
                        </template>
                        <template #item="{ item }">
                            <span class="text-white">{{ item.name }}</span>
                        </template>
                    </USelectMenu>

                    <!-- Priority Select -->
                    <USelectMenu
                        v-model="priority"
                        :items="priorityOptions"
                        value-attribute="id"
                        option-attribute="name"
                        class="w-48"
                    >
                        <template #default>
                            <span
                                :class="
                                    priority ? 'text-white' : 'text-gray-400'
                                "
                            >
                                {{ priority?.name || 'Select priority' }}
                            </span>
                        </template>
                        <template #item="{ item }">
                            <span class="text-white">{{ item.name }}</span>
                        </template>
                    </USelectMenu>
                </div>

                <USelect
                    v-if="membersOptions.length > 0"
                    v-model="assignedMember"
                    :items="membersOptions"
                    option-attribute="label"
                    value-attribute="value"
                    placeholder="Assign Member"
                    color="secondary"
                    variant="solid"
                    size="md"
                    class="w-full font-semibold bg-secondary text-info border-secondary"
                />

                <UPopover>
                    <UButton
                        color="secondary"
                        variant="solid"
                        icon="i-lucide-calendar"
                        class="w-33 text-info"
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

            <template #footer>
                <div class="flex justify-end space-x-2">
                    <UButton
                        color="neutral"
                        variant="outline"
                        class="text-info"
                        @click="close"
                    >
                        Cancel
                    </UButton>
                    <UButton
                        color="neutral"
                        variant="outline"
                        class="text-info"
                        :disabled="!task.name"
                        @click="submit"
                    >
                        Add Task
                    </UButton>
                </div>
            </template>
        </UCard>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, shallowRef, watchEffect } from 'vue'
import { useToast } from '#imports'
import type { AddTaskPayload, Task, Priority, Status } from '@/interfaces/task'
import { useHiveStore } from '~/stores/hive'
import { useUserStore } from '~/stores/user'
import {
    CalendarDate,
    DateFormatter,
    getLocalTimeZone,
} from '@internationalized/date'

const props = defineProps({
    isOpen: Boolean,
    task: {
        type: Object as PropType<Task>,
        required: true,
    },
})

const emit = defineEmits(['close', 'submit'])

const toast = useToast()
const userStore = useUserStore()
const hiveStore = useHiveStore()

const df = new DateFormatter('en-US', { dateStyle: 'medium' })

const assignedMember = ref<number | null>(props.task.assignee ?? null)
const membersOptions = ref<{ label: string; value: number | null }[]>([])

const modelValue = shallowRef<CalendarDate | null>(null)
const statusOptions = [
    { id: 'TD', name: 'To Do' },
    { id: 'IP', name: 'In Progress' },
    { id: 'D', name: 'Done' },
    { id: 'OD', name: 'Overdue' },
] satisfies { id: Status; name: string }[]

const priorityOptions = [
    { id: 'H', name: 'High' },
    { id: 'M', name: 'Medium' },
    { id: 'L', name: 'Low' },
] satisfies { id: Priority; name: string }[]

const status = ref(statusOptions[0])
const priority = ref(priorityOptions[1])

const task = ref<AddTaskPayload & { hive: number; created_by: number }>({
    name: '',
    description: '',
    assignee: null,
    due_date: '',
    status: 'TD',
    priority: 'M',
    hive: 1,
    created_by: 0,
})

watchEffect(() => {
    console.log('Current Hive ID:', hiveStore.currentHiveId)
    console.log('Members:', hiveStore.getMembers(hiveStore.currentHiveId ?? 0))
})

watch(
    () => props.task,
    (newTask) => {
        if (newTask) {
            assignedMember.value = newTask.assignee ?? null

            // Optional: also rehydrate other fields like status/priority if editing
            status.value =
                statusOptions.find((s) => s.id === newTask.status) ||
                statusOptions[0]
            priority.value =
                priorityOptions.find((p) => p.id === newTask.priority) ||
                priorityOptions[1]
        }
    },
    { immediate: true }
)

watch(
    () => props.isOpen,
    (open) => {
        if (open) {
            resetTask()
            const hiveId = hiveStore.currentHiveId
            if (hiveId !== null) {
                updateMembersOptions(hiveId)
            }
        }
    }
)

watch([status, priority], ([s, p]) => {
    task.value.status = s.id
    task.value.priority = p.id
})

watch(
    () => hiveStore.currentHiveId,
    (hiveId) => {
        if (hiveId) updateMembersOptions(hiveId)
    },
    { immediate: true }
)

watch(modelValue, (val) => {
    if (val) {
        const jsDate = val.toDate(getLocalTimeZone())
        task.value.due_date = jsDate.toISOString().split('T')[0]
    }
})

onMounted(() => {
    const hiveId = hiveStore.currentHiveId
    if (hiveId !== null) {
        const members = hiveStore.getMembers(hiveId)
        console.log('Members from hiveStore:', members)

        membersOptions.value = [
            { label: 'Unassigned', value: null },
            ...members.map((member) => ({
                label: member.user.username,
                value: member.user.id,
            })),
        ]
    }
})

function resetTask() {
    task.value = {
        name: '',
        description: '',
        assignee: null,
        due_date: '',
        status: status.value.id,
        priority: priority.value.id,
        hive: props.task?.hive || 1,
        created_by: 0,
    }

    if (props.task?.due_date) {
        const date = new Date(props.task.due_date)
        modelValue.value = new CalendarDate(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate()
        )
    } else {
        modelValue.value = null
    }

    const hiveId = props.task?.hive || 1
    task.value.hive = hiveId
    updateMembersOptions(hiveId)
}

watch(
    () => props.task?.hive,
    (hiveId) => {
        if (hiveId) updateMembersOptions(hiveId)
    },
    { immediate: true }
)

function close() {
    emit('close')
}

async function updateMembersOptions(hiveId: number) {
    const members = hiveStore.getMembers(hiveId)
    if (!members || members.length === 0) {
        console.warn('No members found for hive', hiveId)
    }

    membersOptions.value = [
        { label: 'Unassigned', value: null },
        ...members.map((m) => ({
            label: m.user.username,
            value: m.user.id,
        })),
    ]
}

async function submit() {
    if (!task.value.name) return

    task.value.assignee = assignedMember.value ?? null
    task.value.created_by = userStore.user?.id || 0

    const finalTask = {
        ...task.value,
        due_date: task.value.due_date,
    }

    try {
        emit('submit', finalTask)
        toast.add({ title: 'Task added successfully!', color: 'success' })
        close()
    } catch (err) {
        console.error('Failed to submit task:', err)
        toast.add({ title: 'Failed to add task.', color: 'error' })
    }
}
</script>
