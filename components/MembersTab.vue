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
            
            <UModal 
                title="Add Member" 
                v-model:open="isAddMemberModalOpen" 
                :ui="{ footer: 'justify-end' }" 
                color="primary"
            >
                <UButton
                    color="primary"
                    variant="ghost"
                    size="xs"
                    icon="i-heroicons-plus-20-solid"
                    class="bg-[#FAD59A] text-[#A86523] rounded-lg p-3 shadow hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center aspect-square hover:bg-[#ffd7af] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A86523] cursor-pointer"
                    @click="addMember"
                />
                <template #body>
                    <UForm @submit="inviteNewMember">
                        <UFormField label="Username" required>
                            <UInput 
                                v-model="inviteUsername"
                                placeholder="Enter username"
                                class="w-full"
                            />
                        </UFormField>
                    </UForm>
                </template>

                <template #footer>
                    <UButton label="Cancel" color="primary" variant="ghost" @click="isAddMemberModalOpen = false" />
                    <UButton label="Send Invite" type="submit" :loading="isSending" color="primary" @click="inviteNewMember" />
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
const inviteUsername = ref('')
const isSending = ref(false)
const userStore = useUserStore()
const hiveStore = useHiveStore()
const toast = useToast()

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

async function inviteNewMember() {
    console.log('Submitting new member...')

    if (!inviteUsername.value.trim()) return
    
    isSending.value = true

    try {
        // 1. Call your existing inviteMember method
        const response = await hiveStore.inviteMember(inviteUsername.value)
        
        if (response?.success) {
            // 2. Refresh notifications for the current user
            await userStore.fetchNotifications()
            
            // 3. Show success feedback
            toast.add({
                title: 'Invite sent!',
                description: `Invitation sent to @${inviteUsername.value}`,
                color: 'success'
            })

            // 4. Close modal and reset
            isAddMemberModalOpen.value = false
            inviteUsername.value = ''
        }
    } catch (error:any) {
        toast.add({
            title: 'Failed to send invite',
            description: error.data?.message || 'User not found',
            color: 'error'
        })
    } finally {
        isSending.value = false
    }
}
</script>
  

  