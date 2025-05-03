import { defineStore } from 'pinia'
import api from '~/api/api'
import type { Task, TaskResponse } from '~/interfaces/task'
import type { ApiResponse, ApiError } from '~/interfaces/common'

export const useUserTaskStore = defineStore('userTasks', {
    state: () => ({
        tasks: [] as Task[],
        isLoading: false,
    }),
    actions: {
        async fetchUserTasks(userId: number) {
            this.isLoading = true
            const res = await api.get<ApiResponse<Task[]>>(
                `/task/?assignee=${userId}`
            )
            this.tasks = res.data?.data || []
            this.isLoading = false
        },
        clear() {
            this.tasks = []
        },
    },
})

export const useHiveTaskStore = defineStore('hiveTasks', {
    state: () => ({
        tasks: [] as Task[],
        isLoading: false,
    }),
    actions: {
        async fetchHiveTasks(hiveId: number) {
            this.isLoading = true
            const res = await api.get<ApiResponse<Task[]>>(
                `/task/?hive=${hiveId}`
            )
            this.tasks = res.data?.data || []
            this.isLoading = false
        },
        clear() {
            this.tasks = []
        },
    },
})
