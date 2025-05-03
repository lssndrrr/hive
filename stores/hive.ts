// stores/useTaskStore.ts
import { defineStore } from 'pinia'
import api from '~/api/api'
import type { Hive, HiveResponse, HiveMember } from '~/interfaces/hive'
import type { Task } from '~/interfaces/task'
import type { ApiResponse, ApiError } from '~/interfaces/common'

export const useHiveStore = defineStore('hive', {
    state: () => ({
        hives: [] as Hive[],
        currentHiveId: null as number | null,
        hiveTasks: {} as Record<number, Task[]>,
        isLoading: false,
    }),

    actions: {
        async fetchUserHives() {
            this.isLoading = true
            const res = await api.get<ApiResponse<HiveResponse[]>>('/hive/')
            if (res.data?.success) {
                this.hives = res.data.data || []
            }
            this.isLoading = false
        },

        async fetchHiveTasks(hiveId: number) {
            this.isLoading = true
            const res = await api.get<ApiResponse<Task[]>>(
                `/task/?hive=${hiveId}`
            )
            if (res.data?.success) {
                this.hiveTasks[hiveId] = res.data.data || []
            }
            this.isLoading = false
        },

        getTasksForHive(hiveId: number): Task[] {
            return this.hiveTasks[hiveId] || []
        },

        getMembers(hiveId: number): HiveMember[] {
            return this.hives.find((h) => h.id === hiveId)?.members || []
        },
    },
})
