<template>
    <aside
        class="w-[25%] h-full bg-secondary fixed top-0 right-0 flex flex-col"
        @click.stop
    >
        <!-- Status and Close Header -->
        <div
            class="flex border-b border-primary bg-secondary text-info items-center justify-between p-2"
            style="font-family: 'Nexa'; font-weight: 800"
        >
            Edit Task
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
        <div class="w-100 flex-grow overflow-y-auto px-14 py-4 space-y-2">
            <div class="flex flex-col gap-4">
                <USelect
                    v-model="currentStatus"
                    :items="statusOptions"
                    option-attribute="label"
                    value-attribute="value"
                    placeholder="Select Status"
                    color="secondary"
                    variant="solid"
                    size="sm"
                    class="w-32 font-semibold bg-white text-secondary border-secondary"
                />
                <USelect
                    v-model="assignedMember"
                    :items="membersOptions"
                    option-attribute="label"
                    value-attribute="value"
                    placeholder="Assign Member"
                    color="secondary"
                    variant="solid"
                    size="sm"
                    class="w-32 font-semibold bg-white text-secondary border-secondary"
                />
            </div>
        </div>

        <!-- Delete Button -->
        <div class="flex px-8 py-4 border-t border-[#A86523]/50">
            <div class="flex px-8 py-4 justify-end">
                <UButton
                    color="primary"
                    variant="solid"
                    size="sm"
                    class="text-white"
                    @click="saveTaskChanges"
                >
                    Save Changes
                </UButton>
            </div>
            <UButton
                color="neutral"
                variant="ghost"
                icon="material-symbols:delete-outline-rounded"
                size="sm"
                class="text-white hover:bg-primary hover:text-white"
                @click="deleteTask"
            >
                Delete Task
            </UButton>
        </div>
    </aside>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useUserStore } from '~/stores/user'
import { storeToRefs } from 'pinia'
import type { ApiResponse, User } from '~/interfaces/common'
import type { Task, AddTaskPayload, Status } from '~/interfaces/task'
import type { HiveMember } from '~/interfaces/hive'
import { useHiveStore } from '~/stores/hive'

const userStore = useUserStore()
const hiveStore = useHiveStore()
const { user } = storeToRefs(userStore)
const isConfirmDeleteModalOpen = ref(false)

const props = defineProps({
    task: {
        type: Object as PropType<Task>,
        required: true,
    },
})

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

const currentStatus = ref<Status>(props.task.status)
// const assignedMember = ref<number | null>(props.task.assignee || null)
const assignedMember = ref<number | null>(props.task.assignee ?? null)

const membersOptions = ref<{ label: string; value: number | null }[]>([])

onMounted(() => {
    const hiveId = props.task.hive
    const members = hiveStore.getMembers(hiveId)
    console.log('Members from hiveStore:', members)

    membersOptions.value = [
        { label: 'Unassigned', value: null },
        ...members.map((member) => ({
            label: member.user.username, // this is what is displayed
            value: member.user.id, // this is what's stored in assignedMember
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
        emit('close') // Optionally close the panel after deletion
    } else {
        alert('Failed to delete task: ' + response?.message)
    }
}

async function saveTaskChanges() {
    const payload: Partial<AddTaskPayload> = {}

    if (currentStatus.value !== props.task.status) {
        payload.status = currentStatus.value
    }

    // Only send if assigned user changed
    if (assignedMember.value !== props.task.assignee) {
        payload.assignee = assignedMember.value
    }

    console.log('Assigned Member ID:', assignedMember.value)
    console.log('Payload being sent:', payload)

    if (Object.keys(payload).length === 0) {
        alert('No changes to save.')
        return
    }

    const response = await hiveStore.updateTask(props.task.id, payload)

    if (response?.success) {
        alert('Task updated successfully!')
        emit('close')
    }
}
</script>
