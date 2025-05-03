<template>
    <div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">

            <div
                v-for="member in members"
                :key="member.id"
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
                <span class="text-sm font-medium truncate w-full text-center">{{ member.username }}</span>
            </div>
            
            <button
                @click="addMember"
                class="bg-[#FAD59A] text-[#A86523] rounded-lg p-3 shadow hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center aspect-square hover:bg-[#ffd7af] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A86523] cursor-pointer"
                aria-label="Add new member"
            >
                <Icon name="i-heroicons-plus-20-solid" class="w-8 h-8" />
            </button>

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

const emit = defineEmits(['add-member-clicked', 'view-member-details']);

function addMember() {
    console.log('Add member clicked');
    emit('add-member-clicked');
}

function viewMember(member: HiveMember) {
    console.log('View member details:', member); // Debug log
    emit('view-member-details', member);
}

</script>
  

  