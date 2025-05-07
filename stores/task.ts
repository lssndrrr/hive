import { defineStore } from 'pinia'
import api from '~/api/api'
import type { Task, NewTask, TaskResponse } from '~/interfaces/task'
import type { ApiResponse, ApiError } from '~/interfaces/common'
import { useUserStore } from '@/stores/user'

export const useUserTaskStore = defineStore('userTasks', {
    state: () => ({
        tasks: [] as Task[],
        isLoading: false,
    }),
    actions: {
        async fetchUserTasks() {
            this.isLoading = true
            try {
                const res = await api.get<ApiResponse<Task[]>>('/task/')
                console.log('Raw API response:', res.data)
                console.log('Fetched user tasks:', res.data?.data)
                this.tasks = res.data?.data || []
            } catch (error) {
                console.error('Error fetching user tasks:', error)
            } finally {
                this.isLoading = false
            }
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
        async createHiveTask(task: NewTask) {
            const userStore = useUserStore()

            task.assignee = userStore.user?.id || 1
            task.date = task.date || new Date()

            console.log('Creating:', task)
            try {
                const res = await api.post<ApiResponse<Task>>('/task/', {
                    // POST request to /task/
                    ...task,
                    due_date: task.date?.toISOString().split('T')[0], // convert to 'YYYY-MM-DD' if needed
                })
                if (res.data?.data) {
                    console.log('New task:', res.data.data)
                    this.tasks.push(res.data.data)
                }
            } catch (error) {
                console.error('Failed to create task:', error)
            }
        },
        clear() {
            this.tasks = []
        },
    },
})
