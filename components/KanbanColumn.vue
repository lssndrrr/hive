<template>
    <div class="w-[50%] h-100 bg-[#FCEFCB] p-4 rounded-lg flex flex-col">
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
            :assigneeName="getAssigneeName(task.assignee)"
            :assigneeAvatarUrl="getAssigneeAvatar(task.assignee)"
            @view-task-details="onViewTaskDetails"
            @edit-task="onEditTask"
            @delete-task="onDeleteTask"
          />
          <div v-if="tasks.length === 0" class="text-center text-gray-500 dark:text-gray-400 text-sm mt-4">
             No tasks yet.
           </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import type { PropType } from 'vue';
    import type { Task } from '~/interfaces/task';
    import type { HiveMember } from '~/interfaces/hive';


    const props = defineProps({
      title: {
          type: String as PropType<string>,
          required: true,
      },
      // Expect an array of Task objects
      tasks: {
          type: Array as PropType<Task[]>,
          required: true,
          default: () => [],
      },
      // Expect an array of HiveMember objects for assignee lookup
      members: {
          type: Array as PropType<HiveMember[]>,
          required: true, // Required to display assignee info
          default: () => [],
      }
    });

    const emit = defineEmits(['view-task-details', 'edit-task', 'delete-task']);

    function getAssigneeName(assigneeId: number | null): string | null {
        if (assigneeId === null) return null;
        const member = props.members.find(m => m.id === assigneeId);
        return member?.username || null; // Use username based on HiveMember interface
    }

    // Helper function to find assignee avatar by ID (assuming avatarUrl exists on HiveMember)
    function getAssigneeAvatar(assigneeId: number | null): string | null {
        if (assigneeId === null) return null;
        const member = props.members.find(m => m.id === assigneeId);
        // Assuming your HiveMember interface might have an avatarUrl property
        // Adjust 'avatarUrl' if the property name is different
        return (member as any)?.avatarUrl || null; // Use 'as any' or add avatarUrl to HiveMember interface
    }

    // Relay events from KanbanTaskCard upwards
    function onViewTaskDetails(task: Task) {
        emit('view-task-details', task);
    }

    function onEditTask(task: Task) {
        console.log('KanbanColumn emitting edit-task:', task);
        emit('edit-task', task);
    }

    function onDeleteTask(taskId: number) {
        console.log('KanbanColumn emitting delete-task:', taskId);
        emit('delete-task', taskId);
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