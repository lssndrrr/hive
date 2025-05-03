<template>
    <aside class="w-[25%] h-full bg-[#FCEFCB] fixed top-0 right-0 flex flex-col">
        <div class="flex border-b-1 border-[#A86523] bg-[#FCEFCB] items-center justify-between p-2">
            <div class="flex items-center">
                <USelect
                    v-model="value" :items="items" 
                    color="neutral"
                    variant="subtle"
                    size="sm"
                    class="w-28 font-bold bg-white text-[#A86523] border-0"
                />

            </div>
            <UButton
            color="neutral"
            variant="link"
            icon="mingcute:close-fill"
            size="sm"
            class="text-[#A86523] hover:text-[#E9A319] cursor:pointer"
            @click="closePanel"
            />    
        </div>
        
        <div class="flex flex-col justify-center px-8 py-4 mb-4">
            <h3 class="text-xl font-bold text-[#A86523] mb-4">Untitled</h3>
            <p class="text-sm text-[#A86523]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lorem urna, fringilla id vehicula vel, tincidunt lobortis turpis. Vivamus sit amet dictum nibh, a rhoncus ipsum. Sed sit amet pharetra mauris. Integer posuere mauris nec eros convallis blandit. 
            </p>
        </div>
        
        <div class="flex flex-col justify-center px-8 mb-4">
            <UButton
                color="neutral"
                variant="solid"
                icon="mdi:calendar"
                size="md"
                class="text-[#A86523] hover:bg-[#E9A319] hover:text-white mb-2 cursor:pointer"
            >
            Select a Due Date
            </UButton>
            <UButton
                color="neutral"
                variant="solid"
                icon="material-symbols:person-rounded"
                size="md"
                class="text-[#A86523] hover:bg-[#E9A319] hover:text-white mb-2 cursor:pointer"
            >
            Assign To
            </UButton>
        </div>

        <div class="flex px-8 py-4 mt-auto justify-end">
            <UButton
                color="neutral"
                variant="ghost"
                icon="material-symbols:delete-outline-rounded"
                size="sm"
                class="text-[#A86523] hover:bg-[#E9A319] hover:text-white mb-2 cursor:pointer"
            >
            Delete
            </UButton>
        </div>

    </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { PropType } from 'vue';
import type { Task } from '~/types';

const items = ref(['To Do', 'In Progress', 'Done'])
const value = ref('To Do')

const props = defineProps({
  task: {
    type: Object as PropType<Task>,
    required: true
  }
});

const emit = defineEmits(['close']);

function closePanel() {
  emit('close');
}
</script>