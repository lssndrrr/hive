<template>
    <div class="w-[50%] h-150 bg-[#FCEFCB] p-4 rounded-lg flex flex-col">
        <div class="flex justify-between items-center mb-3 pb-2 border-b border-[#A86523] flex-shrink-0">
          <h2 class="text-md font-semibold text-[#A86523]  uppercase tracking-wide">{{ title }}</h2>
          <span class="text-[#FCEFCB] bg-[#A86523]  text-xs font-bold px-2 py-0.5 rounded-full">
            {{ tasks.length }}
          </span>
        </div>

        <div class="flex-grow overflow-y-auto task-list-scroll">
          <KanbanTaskCard
            v-for="task in tasks"
            :key="task.id"
            :task="task"
            @view-details="onViewDetails"
          />
          <div v-if="tasks.length === 0" class="text-center text-gray-500 dark:text-gray-400 text-sm mt-4">
             No tasks yet.
           </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import type { Task } from '~/types';

    const props = defineProps({
      title: {
        type: String,
        required: true,
        default: 'Column Title',
      },
      tasks: {
        type: Array,
        required: true,
        default: () => [],
      },
    });

    const emit = defineEmits(['view-task-details'])

    function onViewDetails(task: Task) { 
      emit('view-task-details', task) 
    }
</script>

<style scoped>
  .task-list-scroll {
    &::-webkit-scrollbar {
      display: none;
    }
    scrollbar-width: none;
    overflow-y: auto;
  }
</style>