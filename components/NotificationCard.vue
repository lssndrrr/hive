<template>
    <UCard
        variant="solid"
        class="bg-[#fff8e5]"
        :ui="{ root: 'space-y-0', header: 'sm:px-4 px-2 sm:pt-3 pt-2', body: 'sm:px-4 sm:py-0', footer: 'sm:px-4 px-2 pt-3'}"
        @click="handleClick"
    >
        <template #header>
            <h1
                style="font-family: 'Nexa'; font-weight: 800"
                class="text-[#A86523]"
            >
            {{ notificationTitle }}
            </h1>
        </template>

        <template #default> 
            <p class="text-[#A86523] text-xs" style="font-family: 'Nexa'; font-weight: 200">
                {{ notification.message }}
            </p>
            <p class="text-[#A86523]/50 text-xs mt-1">
                {{ formatDate(notification.created_at) }}
            </p>
        </template>


        <template v-if="notification.type === 'INV'" #footer>
            <div class="flex justify-between space-x-2">
                <UButton
                    label="Accept"
                    size="sm"
                    :ui="{ base: 'text-white cursor-pointer w-full justify-center' }"
                    style="font-family: 'Nexa'; font-weight: 800"
                    @click.stop="emit('accept')"
                />
                <UButton
                    label="Decline"
                    size="sm"
                    :ui="{ base: 'text-white cursor-pointer w-full justify-center' }"
                    style="font-family: 'Nexa'; font-weight: 800"
                    @click.stop="emit('decline')"
                />
            </div>
        </template>
    </UCard>
</template>

<script setup lang="ts">
import type { Notification } from '~/interfaces/notifs'
import { format } from 'date-fns'

const props = defineProps<{
    notification: Notification
}>()

const emit = defineEmits(['accept', 'decline'])
const userStore = useUserStore()

const notificationTitle = computed(() => {
    switch(props.notification.type) {
        case 'INV': return 'Hive Invitation'
        case 'REM': return 'Reminder'
        default: return 'Notification'
    }
})

const formatDate = (dateString: string) => {
    try {
        return format(new Date(dateString), 'MMM d, yyyy h:mm a')
    } catch {
        return ''
    }
}

const handleClick = async () => {
    if (!props.notification.is_read) {
        await userStore.markNotificationAsRead(props.notification.id)
    }
}
</script>