<template>
    <div class="bg-[#FCEFCB] text-[#A86523] rounded-lg p-4">
        <div class="flex justify-between items-center mb-4">
            <UButton
                icon="i-heroicons-chevron-left-20-solid"
                variant="ghost"
                color="neutral"
                size="sm"
                class="text-[#A86523]"
                @click="previousWeek"
                aria-label="Previous week"
            />

            <h3 class="text-lg font-semibold">
                {{ currentMonthName }} {{ currentYear }}
            </h3>

            <UButton
                icon="i-heroicons-chevron-right-20-solid"
                variant="ghost"
                color="neutral"
                size="sm"
                class="text-[#A86523]"
                @click="nextWeek"
                aria-label="Next week"
            />
        </div>

        <div class="grid grid-cols-7 gap-1">
            <div v-for="dayName in dayNames" :key="dayName" class="text-center text-xs font-medium text-[#A86523]/80 pb-1 border-b border-[#A86523]/20">
                {{ dayName }}
            </div>

            <div
                v-for="day in weekDates"
                :key="day.toISOString()"
                :class="[
                'border border-[#A86523]/20 rounded p-2 min-h-[100px] flex flex-col',
                isToday(day) ? 'bg-[#A86523]/10' : '', // Highlight today
                isCurrentMonth(day) ? '' : 'bg-[#A86523]/5 text-[#A86523]/50' // Dim days outside current month
                ]"
            >
                <span :class="['font-medium text-sm mb-1', isToday(day) ? 'text-[#E9A319] font-bold' : '']">
                {{ format(day, 'd') }}
                </span>

                <div class="flex-grow overflow-y-auto text-xs space-y-1 task-list-day-scroll">
                    <div
                        v-for="task in tasksByDate[format(day, 'yyyy-MM-dd')]"
                        :key="task.id"
                        class="bg-[#FAD59A] p-1 rounded text-[#A86523] truncate cursor-pointer hover:bg-[#E9A319]/50"
                        @click="emit('view-task-details', task)"
                    >
                        {{ task.name }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addDays,
  subDays,
  format,
  isToday,
  isSameMonth,
  startOfMonth // Import startOfMonth
} from 'date-fns';
import type { PropType } from 'vue';
// Assuming Task type is defined in ~/types or similar
import type { Task } from '~/interfaces/task';

const props = defineProps({
  tasks: {
    type: Array as PropType<Task[]>,
    default: () => []
  },
  // Optional: Allow starting week to be passed in
  initialDate: {
      type: Date,
      default: () => new Date()
  }
});

const emit = defineEmits(['view-task-details']);

const currentStartDate = ref(startOfWeek(props.initialDate, { weekStartsOn: 1 }));

const weekDates = computed(() => {
  const start = currentStartDate.value;
  const end = endOfWeek(start, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
});

// Group tasks by date for easy lookup
const tasksByDate = computed(() => {
  const grouped: Record<string, Task[]> = {};
  props.tasks.forEach(task => {
    if (task.due_date) {
      try {
        const dateKey = format(new Date(task.due_date), 'yyyy-MM-dd');
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(task);
      } catch (e) {
          console.error("Error parsing task date:", task.due_date, e);
      }
    }
  });
  return grouped;
});

// Get month name for the header (based on the first visible day)
const currentMonthName = computed(() => {
    // Show month of the majority of the week, typically the 4th day (index 3)
    const middleOfWeek = weekDates.value[3] || weekDates.value[0];
    return format(middleOfWeek, 'MMMM');
});

// Get year for the header
const currentYear = computed(() => {
    const middleOfWeek = weekDates.value[3] || weekDates.value[0];
    return format(middleOfWeek, 'yyyy');
});

// Day names for header row
const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// --- Methods ---
function previousWeek() {
  currentStartDate.value = subDays(currentStartDate.value, 7);
}

function nextWeek() {
  currentStartDate.value = addDays(currentStartDate.value, 7);
}

function isCurrentMonth(date: Date): boolean {
    // Check if the date is in the same month as the start of the week's month
    const startOfMonthForWeek = startOfMonth(currentStartDate.value);
    return isSameMonth(date, startOfMonthForWeek);
}

// Watch for changes in the initialDate prop if needed
watch(() => props.initialDate, (newDate) => {
    currentStartDate.value = startOfWeek(newDate, { weekStartsOn: 1 });
});

</script>