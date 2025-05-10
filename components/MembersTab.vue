<template>
    <div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">

            <div
                v-for="member in members"
                :key="member.user.id"
                class="bg-[#FCEFCB] text-[#A86523] rounded-lg p-3 hover:shadow-md transition-shadow duration-200 flex flex-col items-center"
                @click="viewMember(member)"
            >
                <div class="w-full aspect-square bg-[#FAD59A] rounded mb-2 flex items-center justify-center">
                    <Icon 
                        name="i-heroicons-user" 
                        class="w-1/2 h-1/2 
                        text-[#A86523]" 
                    />
                </div>
                <span class="text-sm font-medium truncate w-full text-center">{{ member.user.username }}</span>
            </div>
            
            <UModal title="Add Member" v-model:open="isAddMemberModalOpen" :ui="{ footer: 'justify-end' }" color="primary">
                <UButton
                    color="primary"
                    variant="ghost"
                    size="xs"
                    icon="i-heroicons-plus-20-solid"
                    class="bg-[#FAD59A] text-[#A86523] rounded-lg p-3 shadow hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center aspect-square hover:bg-[#ffd7af] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A86523] cursor-pointer"
                    @click="addMember"
                />

                <template #body>
                    <UInput 
                        placeholder="Enter username"
                        color="primary"
                        class="w-full"
                    />
                </template>

                <template #footer>
                    <UButton label="Cancel" color="primary" variant="ghost" @click="isAddMemberModalOpen = false" />
                    <UButton label="Send Invite" color="primary" @click="submitNewMember" />
                </template>
            </UModal>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import type { PropType } from 'vue';
import type { HiveMember } from '~/interfaces/hive';

const props = defineProps({
members: {
    type: Array as PropType<HiveMember[]>,
    default: () => []
}
});

const isAddMemberModalOpen = ref(false)

const emit = defineEmits(['add-member-clicked', 'view-member-details']);

function addMember() {
    console.log('Add member clicked');
    emit('add-member-clicked');
}

function viewMember(member: HiveMember) {
    console.log('View member details:', member); // Debug log
    emit('view-member-details', member);
}

function handleAddNewMember() {
    console.log('Handling add new member...')
    isAddMemberModalOpen.value = true
}

function submitNewMember() {
    console.log('Submitting new member...')
    // Add logic here to gather form data and send it to your backend/API
    isAddMemberModalOpen.value = false
}
</script>
  

  