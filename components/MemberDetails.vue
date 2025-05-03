<template>
    <aside class="w-[25%] h-full bg-[#FCEFCB] fixed top-0 right-0 flex flex-col space-y-4" @click.stop>
        <div class="flex border-b border-[#A86523]/50 bg-[#FCEFCB] items-center justify-end p-2 flex-shrink-0">
            <UButton
                color="neutral" variant="ghost" icon="i-heroicons-x-mark-20-solid" size="sm"
                class="-my-1 text-[#A86523] hover:text-[#E9A319]"
                @click="closePanel"
                aria-label="Close details panel"
            />
        </div>

        <div class="flex-grow overflow-y-auto px-8 py-4 space-y-6">
            <div class="flex flex-col items-center justify-center space-y-4 text-center">
                <UAvatar
                    size="xl"
                    :alt="member.username"
                    icon="i-heroicons-user"
                />
                <h3 class="text-xl font-bold text-[#A86523]">{{ member.username || 'Member Name' }}</h3>
            </div>

            <div class="space-y-1">
                <p class="text-sm font-medium text-[#A86523]/80">Email</p>
                <p class="text-sm text-[#A86523] break-words">
                    {{ member.email || 'No email provided' }}
                </p>
            </div>

            <div class="space-y-1">
                <p class="text-sm font-medium text-[#A86523]/80">Date Joined</p>
                <p class="text-sm text-[#A86523]">
                    {{ member.joined_on ? formatDate(member.joined_on) : 'Date not available' }}
                </p>
            </div>

            </div>

        <div class="flex px-8 py-4 justify-end border-t border-[#A86523]/50 flex-shrink-0">
            <UButton
                color="neutral"
                variant="ghost"
                icon="i-heroicons-trash-20-solid"
                size="sm"
                class="text-red-600 hover:bg-red-100"
            >
                Remove Member
            </UButton>
        </div>

    </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { PropType } from 'vue';
import { format } from 'date-fns';
import type { HiveMember } from '~/interfaces/hive';

const props = defineProps({
  member: {
    type: Object as PropType<HiveMember>,
    required: true
  }
});

const emit = defineEmits(['close']);

function closePanel() {
  emit('close');
}

const formatDate = (date: string | Date | undefined) => {
    if (!date) return 'N/A';
    try {
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) { throw new Error('Invalid date value'); }
        // Example format: January 15, 2024
        return format(dateObj, 'MMMM d, yyyy');
    } catch (e) {
        console.error("Error formatting date:", e);
        return 'Invalid Date';
    }
};

</script>