<template>
    <aside
        v-if="isOpen"
        class="w-46 h-screen bg-[#FCEFCB] fixed top-0 left-16 z-40 flex flex-col p-4 shadow-lg"
        aria-labelledby="hive-panel-title"
    >
        <div class="flex items-center justify-between mb-4 pb-2 border-b border-[#A86523]/30">
            <h2 id="hive-panel-title" class="text-lg font-semibold text-[#A86523]">Hives</h2>
        </div>

    </aside>
</template>

<script setup lang="ts">
    import { ref, type PropType } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import { useToast } from '#imports';


    const props = defineProps({
        isOpen: {
            type: Boolean,
            default: false,
        },
    });

    const emit = defineEmits(['close', 'add-hive']);

    const router = useRouter();
    const route = useRoute();
    const toast = useToast();
</script>