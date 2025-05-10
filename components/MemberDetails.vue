<template>
    <aside
        class="w-[25%] h-full bg-[#FCEFCB] fixed top-0 right-0 flex flex-col space-y-4"
        @click.stop
    >
        <div
            class="flex border-b border-[#A86523]/50 bg-[#FCEFCB] items-center justify-end p-2 flex-shrink-0"
        >
            <UButton
                color="neutral"
                variant="ghost"
                icon="i-heroicons-x-mark-20-solid"
                size="sm"
                class="-my-1 text-[#A86523] hover:text-[#E9A319]"
                @click="closePanel"
                aria-label="Close details panel"
            />
        </div>

        <div class="flex-grow overflow-y-auto px-8 py-4 space-y-6">
            <div
                class="flex flex-col items-center justify-center space-y-4 text-center"
            >
                <UAvatar
                    size="xl"
                    :alt="member.user.username"
                    icon="i-heroicons-user"
                    src="/img/bee.jpg"
                />
                <h3 class="text-xl font-bold text-[#A86523]">
                    {{ member.user.username || 'Member Name' }}
                </h3>
            </div>

            <div class="space-y-1">
                <p class="text-sm font-medium text-[#A86523]/80">Email</p>
                <p class="text-sm text-[#A86523] break-words">
                    {{ member.user.email || 'No email provided' }}
                </p>
            </div>

            <div class="space-y-1">
                <p class="text-sm font-medium text-[#A86523]/80">Date Joined</p>
                <p class="text-sm text-[#A86523]">
                    {{
                        member.joined_on
                            ? formatDate(member.joined_on)
                            : 'Date not available'
                    }}
                </p>
            </div>
            <div class="space-y-1">
                <p class="text-sm font-medium text-[#A86523]/80">Role</p>
                <p class="text-sm text-[#A86523]">
                    {{ getRoleName(member.role) || 'No role assigned' }}
                </p>
                <!-- Role Selector -->
                <div
                    v-if="user?.id !== member.user.id && userRole === 'QB'"
                    class="flex items-end gap-2 py-10"
                >
                    <USelect
                        v-model="selectedRole"
                        :items="roleOptions"
                        option-attribute="label"
                        value-attribute="value"
                        size="sm"
                        class="w-36"
                    />
                    <UButton
                        size="sm"
                        color="primary"
                        @click="changeRole"
                        :disabled="selectedRole === member.role"
                    >
                        Assign
                    </UButton>
                </div>
            </div>
        </div>
        <div
            class="flex px-8 py-4 justify-end border-t border-[#A86523]/50 flex-shrink-0"
        >
            <UButton
                v-if="member.user.id !== user?.id || member.role !== 'QB'"
                color="primary"
                variant="ghost"
                icon="i-heroicons-trash-20-solid"
                size="sm"
                class="text-error hover:bg-secondary"
                @click="removeMember"
            >
                Remove Member
            </UButton>
        </div>
    </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PropType } from 'vue'
import { format } from 'date-fns'
import type { HiveMember } from '~/interfaces/hive'
import { useUserStore } from '~/stores/user'
import { computed } from 'vue'

const authStore = useUserStore()
const user = authStore.user
const currentHive = computed(() =>
    hiveStore.hives.find((h) => h.id === hiveStore.currentHiveId)
)

const userRole = computed(
    () => currentHive.value?.members.find((m) => m.user.id === user?.id)?.role
)
const props = defineProps({
    member: {
        type: Object as PropType<HiveMember>,
        required: true,
    },
})

const emit = defineEmits(['close'])
const isConfirmDeleteModalOpen = ref(false)
const hiveStore = useHiveStore()

const formatDate = (date: string | Date | undefined) => {
    if (!date) return 'N/A'
    try {
        const dateObj = new Date(date)
        if (isNaN(dateObj.getTime())) {
            throw new Error('Invalid date value')
        }
        // Example format: January 15, 2024
        return format(dateObj, 'MMMM d, yyyy')
    } catch (e) {
        console.error('Error formatting date:', e)
        return 'Invalid Date'
    }
}

const roleOptions = [
    { value: 'BK', label: 'Buzzkeeper' },
    { value: 'WORKER_BEE', label: 'Worker Bee' },
]

const getRoleName = (role: string) => {
    const roleNames = {
        QB: 'Queen Bee',
        BK: 'Buzzkeeper',
        WORKER_BEE: 'Worker Bee',
    }
    return roleNames[role as keyof typeof roleNames] || 'Unknown Role'
}

function normalizeRole(role: string): 'QB' | 'BK' | 'WORKER_BEE' {
    if (role === 'WORKER_BEE') return 'WORKER_BEE'
    return role as 'QB' | 'BK' | 'WORKER_BEE'
}

const selectedRole = ref<'QB' | 'BK' | 'WORKER_BEE'>(
    normalizeRole(props.member.role)
)

watch(
    () => props.member.role,
    (newRole) => {
        selectedRole.value = normalizeRole(newRole)
    },
    { immediate: true }
)

const changeRole = async () => {
    console.log('Selected role:', selectedRole.value)

    if (hiveStore.currentHiveId === null || !props.member) return

    try {
        await hiveStore.updateMemberRole(
            hiveStore.currentHiveId,
            props.member.user.id,
            selectedRole.value
        )
        alert('Role updated successfully')
    } catch (err) {
        alert('Failed to update rolessss')
    }
}

const removeMember = async () => {
    isConfirmDeleteModalOpen.value = true
    const confirmed = confirm('Are you sure you want to remove this member?')
    if (!confirmed) return
    if (!props.member || !hiveStore.currentHiveId) return
    await hiveStore.removeMemberFromHive(
        hiveStore.currentHiveId,
        props.member.user.id
    )
    emit('close')
}

function closePanel() {
    emit('close')
}
</script>
