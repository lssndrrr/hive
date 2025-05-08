<template>
    <UCard
        variant="soft"
        class="mb-2 bg-[#FAD59A] text-[#A86523] cursor-pointer"
        @click="viewDetails"
    >
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-md font-bold text-[#A86523]">{{ task.name }}</h3>
        </div>

        <div class="flex justify-between items-center text-xs text-[#A86523]">
            <div class="flex items-center">
                <Icon
                    name="material-symbols:calendar-month-outline-rounded"
                    class="w-4 h-4 mr-1 bg-[#A86523]"
                />
                <span>{{ formatDate(task.due_date) }}</span>
            </div>

            <div class="flex items-center">
                <Icon
                    name="material-symbols:hive-outline-rounded"
                    class="w-4 h-4 mr-1 bg-[#A86523]"
                />
                <span>{{ task.hive }}</span>
            </div>

            <div class="flex items-center">
                <UAvatar
                    :src="'/img/bee.jpg'"
                    alt="Bee"
                    size="2xs"
                    icon="i-heroicons-user-circle"
                    class="bg-[#A86523] text-[#FFF8E5]"
                />
                <span v-if="!assigneeAvatarUrl" class="ml-1 truncate">{{
                    assigneeName || 'Unassigned'
                }}</span>
            </div>
        </div>
    </UCard>
</template>

<script setup lang="ts">
import { format, isValid } from 'date-fns'
import type { PropType } from 'vue'
import type { Task } from '~/interfaces/task'
import type { HiveMember } from '~/interfaces/hive'
import { useUserTaskStore } from '~/stores/task'
import { useHiveStore } from '~/stores/hive'

const hiveStore = useHiveStore()

const assignee = computed(() => {
    const hiveMembers = hiveStore.getMembers(props.task.hive)
    return hiveMembers.find((m) => m.user.id === props.task.assignee) || null
})

const assigneeName = computed(
    () => assignee.value?.user.username || 'Unassigned'
)

const props = defineProps({
    // Task object conforming to the Task interface
    task: {
        type: Object as PropType<Task>,
        required: true,
    },
    // Assignee details passed down from the parent component
    assigneeName: {
        type: String as PropType<string | null>,
        default: null,
    },
    assigneeAvatarUrl: {
        type: String as PropType<string | null>,
        default: null,
    },
})

const emit = defineEmits(['view-details', 'edit-task', 'delete-task'])

function viewDetails() {
    emit('view-details', props.task)
}

const taskOptions = [
    [
        {
            label: 'Edit',
            icon: 'i-heroicons-pencil-square-20-solid',
            click: () => {
                console.log('Edit task:', props.task.id)
            }, // Placeholder action
        },
    ],
    [
        {
            label: 'Delete',
            icon: 'i-heroicons-trash-20-solid',
            click: () => {
                console.log('Delete task:', props.task.id)
            }, // Placeholder action
        },
    ],
]

const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'No date' // Handle null or undefined
    try {
        const dateObj = new Date(dateString)
        // Check if the parsed date is valid
        if (!isValid(dateObj)) {
            // Optionally log the invalid date string for debugging
            // console.warn(`Invalid date string received: ${dateString}`);
            return 'Invalid date'
        }
        return format(dateObj, 'MMM dd') // Format valid date
    } catch (e) {
        console.error('Error formatting date:', dateString, e)
        return 'Error date' // Indicate an error during formatting
    }
}
</script>

<style scoped></style>
