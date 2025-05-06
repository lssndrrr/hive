<template>
    <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-gray-200/75 p-4"
        @click.self="close"
    >
        <UCard
            class="w-full max-w-md bg-primary text-primary"
            @click.stop
            variant="soft"
        >
            <template #header>
                <div class="flex justify-center items-center">
                    <h2 class="text-lg font-semibold text-white">
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
                        placeholder="Select priority"
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

                <USelectMenu
                    v-model="selectedMember"
                    :items="members"
                    option-attribute="name"
                    value-attribute="id"
                    placeholder="Select member"
                    searchable
                    class="w-full text-white"
                >
                    <template #default>
                        <span
                            :class="
                                selectedMember ? 'text-white' : 'text-white'
                            "
                        >
                            {{ selectedMember?.name || 'Assign member' }}
                        </span>
                    </template>
                    <template #item="{ item }">
                        <span class="text-white">{{ item.name }}</span>
                    </template>
                </USelectMenu>
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
                        >Cancel</UButton
                    >
                    <UButton
                        color="neutral"
                        variant="outline"
                        class="text-info"
                        @click="submit"
                        >Add Task</UButton
                    >
                </div>
            </template>
        </UCard>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { NewTask, Status, Priority } from '@/interfaces/task'
import {
    CalendarDate,
    DateFormatter,
    getLocalTimeZone,
} from '@internationalized/date'

const df = new DateFormatter('en-US', {
    dateStyle: 'medium',
})

const modelValue = shallowRef(new CalendarDate(2022, 1, 10))

const props = defineProps<{
    isOpen: boolean
    members: { id: number | string; name: string }[]
}>()

const selectedMember = ref<{ id: string | number; name: string } | undefined>(
    undefined
)
const emit = defineEmits(['close', 'submit'])

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

const task = ref<NewTask>({
    name: '',
    description: '',
    assignee: undefined,
    date: undefined,
    status: status.value.id,
    priority: priority.value.id,
    hive: 1,
    created_by: 0,
})

watch(
    () => props.isOpen,
    (val) => {
        if (val) {
            resetTask()
        }
    }
)

watch(selectedMember, (member) => {
    task.value.assignee = member ? Number(member.id) : undefined
})

watch([status, priority], ([s, p]) => {
    task.value.status = s.id
    task.value.priority = p.id
})

function resetTask() {
    task.value = {
        name: '',
        description: '',
        assignee: undefined,
        date: undefined,
        status: 'TD',
        priority: 'M',
        hive: 1,
        created_by: 0,
    }
}

function memberName(id: string | number) {
    return props.members.find((m) => m.id === id)?.name ?? ''
}

function close() {
    emit('close')
}

function submit() {
    const finalTask = {
        ...task.value,
        status: status.value.id,
        priority: priority.value.id,
        due_date: task.value.date?.toISOString().split('T')[0] ?? '',
    }

    emit('submit', finalTask)
}
</script>
