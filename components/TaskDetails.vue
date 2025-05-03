<template>
    <aside class="w-[25%] h-full bg-[#FCEFCB] fixed top-0 right-0 flex flex-col" @click.stop>
        <div class="flex border-b border-[#A86523]/50 bg-[#FCEFCB] items-center justify-between p-2 flex-shrink-0">
            <div class="flex items-center">
                <USelect
                    v-model="currentStatus"
                    :items="statusOptions"
                    option-attribute="label"
                    value-attribute="value"
                    color="neutral" variant="outline"
                    size="sm"
                    class="w-32 font-semibold bg-white text-[#A86523] border-[#A86523]/50"
                    @change="updateStatus"
                 />
            </div>
            <UButton
                color="neutral" variant="link" icon="mingcute:close-fill" size="sm"
                class="text-[#A86523] hover:text-[#E9A319]" @click="closePanel"
                aria-label="Close details panel"
            />
        </div>

        <div class="flex-grow overflow-y-auto px-8 py-4 space-y-6">
            <UInput
              v-model="editableTitle"
              @blur="updateTitle"
              @keyup.enter="updateTitle"
              placeholder="Task Title"
              variant="none"
              size="xl"
              class="text-xl font-bold text-[#A86523] -ml-3"
              :ui="{ base: 'w-full' }"
            />

            <div>
                <p class="text-sm text-[#A86523] whitespace-pre-wrap break-words">
                    {{ task.description || 'No description provided.' }}
                </p>
            </div>

            <div class="flex flex-col space-y-2">
                <UPopover :default="{ align: 'center', side: 'bottom', }">
                    <template #default="{ open }">
                        <UButton
                        color="neutral"
                        variant="solid"
                        icon="mdi:calendar"
                        size="md"
                        class="text-[#A86523] hover:bg-[#E9A319] hover:text-white justify-start w-full"
                        :class="[open ? 'bg-[#E9A319]/80 text-white' : '']"
                        :label="editableDueDate ? formatDate(editableDueDate) : 'Select Due Date'"
                        />
                    </template>

                    <template #panel="{ close }">
                        <div class="p-2">
                            <UCalendar
                                v-model="editableDueDate"
                                @update:model-value="handleDateUpdate(close)"
                                :min-date="new Date()" />
                            <div class="flex justify-end pt-2">
                                <UButton
                                    label="Clear"
                                    variant="ghost"
                                    color="neutral"
                                    size="xs"
                                    @click="clearDate(close)"
                                />
                            </div>
                        </div>
                    </template>
                </UPopover>

                <UButton
                    color="neutral" variant="solid" icon="material-symbols:person-rounded" size="md" class="text-[#A86523] hover:bg-[#E9A319] hover:text-white justify-start" @click="emit('assign-user', task)"
                >
                    {{ task.assignee ? `Assigned to ${task.assignee}` : 'Assign To' }}
                </UButton>
            </div>
        </div>

        <div class="flex px-8 py-4 justify-end border-t border-[#A86523]/50 flex-shrink-0">
            <UButton
                color="neutral" variant="ghost" icon="material-symbols:delete-outline-rounded" size="sm"
                class="text-[#A86523] hover:bg-[#E9A319] hover:text-white" @click="deleteTask"
            >
                Delete Task
            </UButton>
        </div>
    </aside>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { PropType } from 'vue';
import { format, isValid } from 'date-fns'; // Import isValid
import type { Task } from '~/interfaces/task';
import type { HiveMember } from '~/interfaces/hive';

// --- Props ---
const props = defineProps({
  task: {
    type: Object as PropType<Task>,
    required: true
  }
});

// --- Emits ---
const emit = defineEmits([
    'close',
    'update-status',
    'update-title',
    'update-date', // Changed from set-due-date
    'assign-user',
    'delete-task'
]);

// --- Local State for Editing ---
const currentStatus = ref(props.task.status || 'todo');
const editableTitle = ref(props.task.name || '');
// Local state for the date picker, initialize carefully
const editableDueDate = ref<Date | undefined>(
    props.task.due_date && isValid(new Date(props.task.due_date)) ? new Date(props.task.due_date) : undefined
);

// --- Watch for prop changes to update local state ---
watch(() => props.task, (newTask) => {
  currentStatus.value = newTask?.status || 'todo';
  editableTitle.value = newTask?.name || '';
  // Update local date only if the prop date is valid
  editableDueDate.value = newTask?.due_date && isValid(new Date(newTask.due_date)) ? new Date(newTask.due_date) : undefined;
}, { immediate: true, deep: true });

// --- Status Options ---
const statusOptions = ref([
  { label: 'To Do', value: 'todo' },
  { label: 'In Progress', value: 'inprogress' },
  { label: 'Done', value: 'done' }
]);


// --- Methods ---
function closePanel() { emit('close'); }

function updateStatus() {
  emit('update-status', { taskId: props.task.id, status: currentStatus.value });
}

function updateTitle() {
    if (editableTitle.value !== props.task.name) {
        emit('update-title', { taskId: props.task.id, title: editableTitle.value });
    }
}

// Handle date selection from calendar
function handleDateUpdate(closePopover: () => void) {
    console.log('Date updated:', editableDueDate.value);
    // Check if the date actually changed
    const originalDateStr = props.task.due_date ? new Date(props.task.due_date).toISOString().split('T')[0] : null;
    const newDateStr = editableDueDate.value ? editableDueDate.value.toISOString().split('T')[0] : null;

    if (originalDateStr !== newDateStr) {
       // Emit the new date (or null if cleared)
       // Send as ISO string or keep as Date object based on your API needs
       emit('update-date', { taskId: props.task.id, date: editableDueDate.value ? editableDueDate.value.toISOString() : null });
    }
    closePopover(); // Close the popover after selection
}

// Handle clearing the date
function clearDate(closePopover: () => void) {
    if (editableDueDate.value !== undefined) { // Only emit if there was a date before
        editableDueDate.value = undefined; // Clear local state
        emit('update-date', { taskId: props.task.id, date: null }); // Emit null for cleared date
    }
    closePopover();
}


function deleteTask() {
  emit('delete-task', props.task.id);
  closePanel();
}

// Format date for display, handle undefined/null
const formatDate = (date: string | Date | undefined | null): string => {
    if (!date) return 'Select Due Date'; // Show placeholder if no date
    try {
        const dateObj = new Date(date);
        if (!isValid(dateObj)) { throw new Error('Invalid date value'); }
        return format(dateObj, 'MMM dd, yyyy'); // Format example
    } catch (e) {
        console.error("Error formatting date:", e);
        return 'Invalid Date';
    }
};

</script>