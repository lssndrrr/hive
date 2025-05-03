<template>
    <div class="space-y-6">
  
        <section>
            <h3 class="text-sm font-semibold uppercase text-[#A86523]/80 mb-2 tracking-wider">To do</h3>
            <div class="space-y-2">
                <div
                    v-for="task in todoTasks"
                    :key="task.id"
                    class="flex items-center justify-between p-3 rounded-lg bg-[#FCEFCB] hover:bg-[#FAD59A] cursor-pointer group"
                    @click="emit('view-task-details', task)"
                >
                    <span class="text-sm text-[#A86523]">{{ task.name }}</span>
                    <UDropdown :items="taskOptions(task)" :popper="{ placement: 'bottom-end' }">
                        <UButton
                            color="neutral"
                            variant="ghost"
                            icon="i-heroicons-ellipsis-horizontal-20-solid"
                            size="xs"
                            class="text-[#A86523] opacity-0 group-hover:opacity-100"
                            @click.stop
                        />
                    </UDropdown>
                </div>

                <div v-if="!todoTasks || todoTasks.length === 0" class="text-center text-sm text-[#A86523] py-4">
                    No tasks here.
                </div>
            </div>
        </section>
    
        <section>
            <h3 class="text-sm font-semibold uppercase text-[#A86523] mb-2 tracking-wider">In progress</h3>
            <div class="space-y-2">
                <div
                    v-for="task in inProgressTasks"
                    :key="task.id"
                    class="flex items-center justify-between p-3 rounded-lg bg-[#FCEFCB] hover:bg-[#FAD59A] cursor-pointer group"
                    @click="emit('view-task-details', task)"
                >
                    <span class="text-sm text-[#A86523]">{{ task.name }}</span>
                    <UDropdown :items="taskOptions(task)" :popper="{ placement: 'bottom-end' }">
                        <UButton
                            color="neutral"
                            variant="ghost"
                            icon="i-heroicons-ellipsis-horizontal-20-solid"
                            size="xs"
                            class="text-[#A86523] opacity-0 group-hover:opacity-100"
                            @click.stop
                        />
                    </UDropdown>
                </div>
                <div v-if="!inProgressTasks || inProgressTasks.length === 0" class="text-center text-sm text-[#A86523]/60 py-4">
                    No tasks here.
                </div>
            </div>
        </section>
    
        <section>
            <h3 class="text-sm font-semibold uppercase text-[#A86523] mb-2 tracking-wider">Done</h3>
            <div class="space-y-2">
                <div
                    v-for="task in doneTasks"
                    :key="task.id"
                    class="flex items-center justify-between p-3 rounded-lg bg-[#FCEFCB] hover:bg-[#FAD59A] cursor-pointer group"
                    @click="emit('view-task-details', task)"
                >
                    <span class="text-sm text-[#A86523] line-through opacity-70">{{ task.name }}</span> 
                    <UDropdown :items="taskOptions(task)" :popper="{ placement: 'bottom-end' }">
                        <UButton
                            color="neutral"
                            variant="ghost"
                            icon="i-heroicons-ellipsis-horizontal-20-solid"
                            size="xs"
                            class="text-[#A86523] opacity-0 group-hover:opacity-100"
                            @click.stop
                        />
                    </UDropdown>
                </div>
                <div v-if="!doneTasks || doneTasks.length === 0" class="text-center text-sm text-[#A86523]/60 py-4">
                    No tasks here.
                </div>
            </div>
        </section>
    
        <div class="mt-6">
            <UButton
            icon="i-heroicons-plus-20-solid"
            size="md"
            color="neutral"
            variant="ghost"
            label="Add task"
            class="text-[#A86523] hover:bg-[#A86523] hover:text-white w-full cursor-pointer"
            @click="emit('add-task')"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { Task } from '~/interfaces/task';

const props = defineProps({
    todoTasks: {
        type: Array as PropType<Task[]>,
        default: () => []
    },
    inProgressTasks: {
        type: Array as PropType<Task[]>,
        default: () => []
    },
    doneTasks: {
        type: Array as PropType<Task[]>,
        default: () => []
    }
});

const emit = defineEmits(['view-task-details', 'add-task']);

const taskOptions = (task: Task) => [
[{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: (event: Event) => { event.stopPropagation(); console.log('Edit task:', task.id); /* Emit edit event */ }
}],
[{
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    click: (event: Event) => { event.stopPropagation(); console.log('Delete task:', task.id); /* Emit delete event */ }
}]
];

</script>
