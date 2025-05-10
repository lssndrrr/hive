<template>
    <aside
        v-if="isOpen"
        class="w-60 h-screen bg-[#FCEFCB] fixed top-0 left-16 z-40 flex flex-col p-4 shadow-lg space-y-4"
        aria-labelledby="hive-panel-title"
    >
        <div class="flex items-center w-full mb-4 pb-2 border-b border-[#A86523]/30 justify-between">
            <div class="flex items-center space-x-2">
                <Icon
                    name="bxs:bell"
                    class="w-6 h-6 bg-[#A86523]"
                />
                <h2 
                    id="hive-panel-title" 
                    class="text-lg font-semibold text-[#A86523]" 
                    style="font-family: 'Nexa'; font-weight: 800"
                >
                    Notifications
                </h2>
            </div>
            <UButton
                icon="material-symbols:close-small-outline-rounded"
                variant="ghost"
                size="sm"
                :ui="{ base: 'cursor-pointer' }"
                @click="emit('close')"
            />
        </div>

        <div class="space-x-2">
            <UButton
                label="All"
                size="xs"
                :ui="{ base: 'text-white cursor-pointer' }"
                @click="filter = 'all'"
            />
            <UButton
                label="Unread"
                size="xs"
                :ui="{ base: 'text-white cursor-pointer' }"
                @click="filter = 'unread'"
            />
        </div>

        <div v-if="isLoading" class="flex justify-center py-4">
            <p>Loading...</p>
        </div>

        <div v-else class="flex flex-col space-y-2">
            <NotificationCard
                v-for="notification in filteredNotifications"
                :key="notification.id"
                :notification="notification"
                @accept="handleAccept(notification.id)"
                @decline="handleDecline(notification.id)"
            />
            <p v-if="!filteredNotifications.length" class="text-center text-gray-500 py-4">
                No {{ filter === 'unread' ? 'unread' : '' }} notifications
            </p>
        </div>
    </aside>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps({
    isOpen: Boolean
});

const emit = defineEmits(['close']);

const userStore = useUserStore()
const filter = ref<'all' | 'unread'>('all')

const isLoading = computed(() => userStore.isLoadingNotifications)
const notifications = computed(() => userStore.notifications)

const filteredNotifications = computed(() => {
  return filter.value === 'unread' 
    ? notifications.value.filter(n => !n.is_read)
    : notifications.value
})

watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) await userStore.fetchNotifications()
})

const handleAccept = async (id: number) => {
  // You'll need to add this method to your user store
  await userStore.respondToNotification(id, true)
}

const handleDecline = async (id: number) => {
  // You'll need to add this method to your user store
  await userStore.respondToNotification(id, false)
}

</script>