<template>
    <aside
        v-if="isOpen"
        class="w-46 h-screen bg-[#FCEFCB] fixed top-0 left-16 z-40 flex flex-col p-4 shadow-lg"
        aria-labelledby="hive-panel-title"
    >
        <div class="flex items-center justify-between mb-4 pb-2 border-b border-[#A86523]/30">
            <h2 id="hive-panel-title" class="text-lg font-semibold text-[#A86523]">Hives</h2>
        </div>

        <div class="flex-grow overflow-y-auto hive-list-scroll justify-between">
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

                        <UPopover :content="{ side: 'right', align: 'start' }" mode="click" >
                            <UButton 
                                icon="i-heroicons-ellipsis-horizontal-20-solid" 
                                color="primary" 
                                variant="soft" 
                                size="xs"
                                class="bg-transparent opacity-0 group-hover:opacity-100 transition-opacity" 
                                aria-label="Hive options" 
                            />

                            <template #content="{ close }">
                                <UModal title="Confirm Delete" v-model="isConfirmDeleteModalOpen" :ui="{ footer: 'justify-end' }" color="primary">
                                    <UButton
                                        label="Delete Hive"
                                        color="primary"
                                        variant="ghost"
                                        size="xs"
                                        icon="material-symbols:delete-rounded"
                                        class="hover:bg-[#FCEFCB] bg-[#FFF8E5] cursor-pointer"
                                        aria-label="Delete Hive"
                                    />

                                    <template #body>
                                        <p class="text-sm">
                                            Are you sure you want to delete the hive "<strong>{{ hive.name }}</strong>"?
                                            <br>This action cannot be undone.
                                        </p>
                                    </template>

                                    <template #footer>
                                        <UButton label="Cancel" color="primary" variant="ghost" @click="isConfirmDeleteModalOpen = false" />
                                        <UButton label="Delete" color="error" @click="confirmDeleteHive" />
                                    </template>
                                </UModal>
                            </template>
                        </UPopover>
                    </NuxtLink>
                </li>
            </ul>
            <div v-if="!hives || hives.length === 0" class="text-center text-[#A86523]/70 text-sm mt-4">
                No hives found.
            </div>
            <NuxtLink
                to="/hive/create" class="inline-flex items-center justify-center px-4 py-2 text-white bg-[#A86523] hover:bg-[#E9A319] rounded-lg shadow text-sm font-medium"
                style="font-family: 'Nexa'; font-weight: 800"
                >
                <Icon name="material-symbols:add-circle-outline" class="w-5 h-5 mr-1" />
                Add Hive
            </NuxtLink>
        </div>
    </aside>
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useHiveStore } from '~/stores/hive'; 
import { useToast } from '#imports';

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

const hiveStore = useHiveStore();
const router = useRouter();
const route = useRoute();
const toast = useToast();

const isConfirmDeleteModalOpen = ref(false);
const hiveToDelete = ref<Hive | null>(null);

function requestDeleteHiveConfirmation(hive: Hive) {
    hiveToDelete.value = hive;
    isConfirmDeleteModalOpen.value = true;
}

async function confirmDeleteHive() {
    if (!hiveToDelete.value) return;

    const deletedHiveId = hiveToDelete.value.id;
    const deletedHiveName = hiveToDelete.value.name; // For toast message

    try {
        await hiveStore.deleteHive(deletedHiveId);
        isConfirmDeleteModalOpen.value = false;
        toast.add({
            title: 'Hive Deleted',
            description: `Hive "${deletedHiveName}" was successfully deleted.`,
            color: 'success',
            icon: 'i-heroicons-check-circle'
        });

        // Check if the currently viewed hive is the one deleted
        const currentRouteHiveIdentifier = route.params.hivename;
        if (currentRouteHiveIdentifier === String(deletedHiveId) || currentRouteHiveIdentifier === hiveToDelete.value.slug) {
            router.push('/'); // Or to a more appropriate default page like '/dashboard' or the first hive
        }
        hiveToDelete.value = null; // Reset
    } catch (error: any) {
        console.error("Failed to delete hive:", error);
        toast.add({
            title: 'Deletion Failed',
            description: hiveStore.error || error.message || 'Could not delete hive.',
            color: 'error',
            icon: 'i-heroicons-x-circle'
        });
        isConfirmDeleteModalOpen.value = false; // Optionally keep open or provide retry
    }
}

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