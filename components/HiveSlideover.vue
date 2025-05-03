<template>
    <aside
        v-if="isOpen"
        class="w-40 h-screen bg-[#FCEFCB] fixed top-0 left-16 z-40 flex flex-col p-4 shadow-lg"
        aria-labelledby="hive-panel-title"
    >
        <div class="flex items-center justify-between mb-4 pb-2 border-b border-[#A86523]/30">
            <h2 id="hive-panel-title" class="text-lg font-semibold text-[#A86523]">Hives</h2>
            
            <div class="flex items-center space-x-1">
                <UButton
                icon="i-heroicons-plus-circle"
                variant="ghost"
                color="neutral"
                size="sm"
                class="text-[#A86523]"
                aria-label="Add new hive"
                @click="emit('add-hive')"
                />
            </div>
        </div>

        <div class="flex-grow overflow-y-auto hive-list-scroll">
            <ul class="space-y-1">
                <li v-for="hive in hives" :key="hive.id">
                    <NuxtLink
                    :to="`/hive/${hive.slug || hive.id}`"
                    class="flex items-center justify-between p-2 rounded hover:bg-[#A86523]/10 text-[#A86523] text-sm group"
                    active-class="bg-[#A86523]/10 font-semibold"
                    >
                        <span class="flex items-center space-x-2">
                        <span v-if="hive.isActive" class="w-2 h-2 rounded-full bg-[#E9A319]"></span>
                        <span>{{ hive.name }}</span>
                        </span>
                        <button class="opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Hive options">
                            <Icon name="i-heroicons-ellipsis-horizontal-20-solid" class="w-4 h-4" />
                        </button>
                    </NuxtLink>
                </li>
            </ul>
            <div v-if="!hives || hives.length === 0" class="text-center text-[#A86523]/70 text-sm mt-4">
                No hives found.
            </div>
        </div>
    </aside>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

interface Hive {
    id: string | number
    name: string
    slug?: string; // For cleaner URL
    isActive?: boolean; // Example property
}

const props = defineProps({
    isOpen: {
    type: Boolean,
    default: false,
    },
    hives: {
    type: Array as PropType<Hive[]>,
    default: () => [],
    },
});

const emit = defineEmits(['close', 'add-hive']);

</script>

<style scoped>

.hive-list-scroll::-webkit-scrollbar {
    width: 5px;
}

.hive-list-scroll::-webkit-scrollbar-track {
    background: transparent;
}

.hive-list-scroll::-webkit-scrollbar-thumb {
    background-color: rgba(168, 101, 35, 0.3); /* Semi-transparent #A86523 */
    border-radius: 3px;
}

.hive-list-scroll {
    scrollbar-width: thin;
    scrollbar-color: rgba(168, 101, 35, 0.3) transparent;
}

</style>