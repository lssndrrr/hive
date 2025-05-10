<template>
    <div class="relative m-4">
        <!-- Make this container relative -->
        <!-- Overlapping priority badge -->
        <p
            class="absolute top-2.5 right-2 z-10 text-xs font-bold bg-primary text-info px-2 py-1 rounded-md shadow"
        >
            {{ displayPriority }}
        </p>

        <!-- The card -->
        <UCard
            variant="soft"
            class="bg-[#fff8e5] text-[#a18c76] cursor-pointer"
            @click="emit('view-task-details', task)"
        >
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-md font-bold text-[#A86523]">
                    {{ task.name }}
                </h3>
            </div>

            <div
                class="flex justify-between items-center text-xs text-[#A86523]"
            >
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
                        :src="'/img/blank.svg'"
                        alt="profile"
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
    </div>
</template>

<script setup lang="ts">
import { format, isValid } from 'date-fns'
import type { PropType } from 'vue'
import type { Task } from '~/interfaces/task'
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

const emit = defineEmits(['view-task-details', 'edit-task', 'delete-task'])

function viewDetails() {
    emit('view-task-details', props.task)
}

const displayPriority = computed(() => {
    switch (props.task.priority) {
        case 'H':
            return 'High'
        case 'M':
            return 'Medium'
        case 'L':
            return 'Low'
        default:
            return 'Unknown'
    }
})

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
