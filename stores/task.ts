// import { defineStore } from 'pinia'
// import api from '~/api/api'
// import type { Task, NewTask, TaskResponse } from '~/interfaces/task'
// import type { ApiResponse, ApiError } from '~/interfaces/common'
// import { useUserStore } from '@/stores/user'

// export const useUserTaskStore = defineStore('userTasks', {
//     state: () => ({
//         tasks: [] as Task[],
//         isLoading: false,
//     }),
//     actions: {
//         async fetchUserTasks() {
//             this.isLoading = true
//             try {
//                 const res = await api.get<ApiResponse<Task[]>>('/task/')
//                 console.log('Raw API response:', res.data)
//                 console.log('Fetched user tasks:', res.data?.data)
//                 this.tasks = res.data?.data || []
//             } catch (error) {
//                 console.error('Error fetching user tasks:', error)
//             } finally {
//                 this.isLoading = false
//             }
//         },
//         clear() {
//             this.tasks = []
//         },
//     },
// })

// export const useHiveTaskStore = defineStore('hiveTasks', {
//     state: () => ({
//         tasks: [] as Task[],
//         isLoading: false,
//     }),
//     actions: {
//         async fetchHiveTasks(hiveId: number) {
//             this.isLoading = true
//             const res = await api.get<ApiResponse<Task[]>>(
//                 `/task/?hive=${hiveId}`
//             )
//             this.tasks = res.data?.data || []
//             this.isLoading = false
//         },
//         async createHiveTask(task: NewTask) {
//             const userStore = useUserStore()

//             // Defensive checks
//             if (!task.hive) {
//                 console.error('Missing hive ID in task')
//                 return
//             }

//             if (!task.status || !task.priority || !task.name) {
//                 console.error(
//                     'Missing required fields: name, status, or priority'
//                 )
//                 return
//             }

//             // Ensure valid date
//             const dueDate =
//                 task.date?.toISOString().split('T')[0] ||
//                 new Date().toISOString().split('T')[0]

//             try {
//                 const res = await api.post<ApiResponse<Task>>('/task/', {
//                     name: task.name,
//                     description: task.description,
//                     assignee: task.assignee,
//                     status: task.status,
//                     priority: task.priority,
//                     hive: task.hive,
//                     created_by: task.created_by,
//                     due_date: dueDate,
//                 })

//                 if (res.data?.data) {
//                     this.tasks.push(res.data.data)
//                 }
//             } catch (error) {
//                 console.error('Failed to create task:', error)
//             }
//         },
//         clear() {
//             this.tasks = []
//         },
//     },
// })

import { defineStore } from 'pinia'
import api from '~/api/api'
import type { Task, NewTask, TaskResponse } from '~/interfaces/task'
import type { ApiResponse, ApiError } from '~/interfaces/common'
import { useUserStore } from '@/stores/user'

export const useUserTaskStore = defineStore('userTasks', {
    state: () => ({
        tasks: [] as Task[], // Tasks for the user
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
        hiveTasks: {} as Record<number, Task[]>, // Tasks for each hive
        isLoading: false,
    }),

    actions: {
        // Fetch tasks for a specific hive by ID
        async fetchHiveTasks(hiveId: number | string) {
            hiveId = Number(hiveId)
            console.log('cry cry cry')
            console.log('hoyyy hive num:', hiveId)
            this.isLoading = true
            try {
                const res = await api.get<ApiResponse<Task[]>>(
                    `/task/?hive=${hiveId}`
                )
                this.hiveTasks[hiveId] = res.data?.data || [] // Store tasks by hive ID
                console.log('Fetched tasks for hive:', this.hiveTasks[hiveId])
                console.log('API response for hive:', res.data)
                console.log('Stored hiveTasks:', this.hiveTasks[hiveId])
            } catch (error) {
                console.error('Error fetching tasks for hive:', error)
            } finally {
                this.isLoading = false
            }
        },

        // Create a new task for a specific hive
        async createHiveTask(task: NewTask) {
            const userStore = useUserStore()
            console.error('hello where are u')

            // Defensive checks
            if (!task.hive) {
                console.error('Missing hive ID in task')
                return
            }

            if (!task.status || !task.priority || !task.name) {
                console.error(
                    'Missing required fields: name, status, or priority'
                )
                return
            }

            // Ensure valid date
            const dueDate =
                task.date?.toISOString().split('T')[0] ||
                new Date().toISOString().split('T')[0]

            try {
                const res = await api.post<ApiResponse<Task>>('/task/', {
                    name: task.name,
                    description: task.description,
                    assignee: task.assignee,
                    status: task.status,
                    priority: task.priority,
                    hive: task.hive,
                    created_by: task.created_by,
                    due_date: dueDate,
                })

                if (res.data?.data) {
                    if (!this.hiveTasks[task.hive]) {
                        this.hiveTasks[task.hive] = []
                    }
                    this.hiveTasks[task.hive].push(res.data.data) // Add task to hive tasks
                }
            } catch (error) {
                console.error('Failed to create task:', error)
            }
        },

        // Clear tasks for all hives
        clear() {
            this.hiveTasks = {} // Reset the hiveTasks dictionary
        },
    },
})
