<template>
    <UCard 
        variant="soft" 
        class="mb-2 bg-[#FAD59A] text-[#A86523] cursor-pointer"
        @click="viewDetails"
    >
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-md font-bold text-[#A86523]">{{ task.title }}</h3>
            
          </div>

          <div class="flex justify-between items-center text-xs text-[#A86523]">
            
            <div class="flex items-center">
                <Icon name="material-symbols:calendar-month-outline-rounded" class="w-4 h-4 mr-1 bg-[#A86523]" />
                <span>{{ formatDate(task.date) }}</span>
            </div>

            <div class="flex items-center">
                <Icon name="material-symbols:hive-outline-rounded" class="w-4 h-4 mr-1 bg-[#A86523]" />
                <span>{{ task.hive }}</span>
            </div>

            <div class="flex items-center">
                <UAvatar
                    :src="task.assignee?.avatarUrl"
                    :alt="task.assignee?.name || 'Unassigned'"
                    size="2xs"
                />
                <span v-if="!task.assignee?.avatarUrl" class="ml-1">{{ task.assignee?.name || 'Unassigned' }}</span>
            </div>

          </div>          
    </UCard>
</template>

<script setup lang="ts">
import { format } from 'date-fns';
import type { PropType } from 'vue';
import type { Task } from '~/types';

    const props = defineProps({
      task: {
        type: Object as PropType<Task>,
        required: true,
      },
    });

    const emit = defineEmits(['view-details']);

    function viewDetails() {
      emit('view-details', props.task);
    }

    const taskOptions = [
      [{
        label: 'Edit',
        icon: 'i-heroicons-pencil-square-20-solid',
        click: () => { console.log('Edit task:', props.task.id) } // Placeholder action
      }], [{
        label: 'Delete',
        icon: 'i-heroicons-trash-20-solid',
        click: () => { console.log('Delete task:', props.task.id) } // Placeholder action
      }]
    ];

    const formatDate = (date) => {
      try {
        // Ensure the input is treated as a Date object
        const dateObj = new Date(date);
        // Check if the date is valid before formatting
        if (isNaN(dateObj.getTime())) {
            throw new Error('Invalid date value');
        }
        return format(dateObj, 'MMM dd'); // e.g., Nov 17
      } catch (e) {
        console.error("Error formatting date:", e); // Log error for debugging
        return 'Invalid Date';
      }
    };

</script>

<style scoped>

</style>