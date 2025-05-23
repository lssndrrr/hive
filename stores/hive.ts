import { defineStore } from 'pinia'
import api from '~/api/api'
import type {
    Hive,
    HiveResponse,
    HiveMember,
    HiveFetchResponse,
    CreateHivePayload,
} from '~/interfaces/hive'
import type { Task, AddTaskPayload } from '~/interfaces/task'
import type { ApiResponse, ApiError } from '~/interfaces/common'

export const useHiveStore = defineStore('hive', {
    state: () => ({
        hives: [] as Hive[],
        currentHiveId: null as number | null,
        hiveTasks: {} as Record<number, Task[]>,
        isLoading: false,
        error: null as string | null,
    }),

    getters: {
        getTasksForHive:
            (state) =>
            (hiveId: number): Task[] => {
                return state.hiveTasks[hiveId] || []
            },
        getMembers:
            (state) =>
            (hiveId: number): HiveMember[] => {
                return state.hives.find((h) => h.id === hiveId)?.members || []
            },
    },

    actions: {
        setCurrentHiveId(hiveId: number) {
            this.currentHiveId = hiveId
        },

        async fetchUserHives(): Promise<
            ApiResponse<HiveFetchResponse> | undefined
        > {
            this.isLoading = true
            this.error = null
            try {
                const response = await api.get<ApiResponse<HiveFetchResponse>>(
                    '/hive/'
                )
                if (response.data) {
                    const hives = response.data.data?.hives || []
                    const tasks = response.data.data?.tasks || []

                    this.hives = hives.map((h) => h as Hive)

                    this.hiveTasks = tasks.reduce((acc, task) => {
                        ;(acc[task.hive] ||= []).push(task)
                        return acc
                    }, {} as Record<number, Task[]>)

                    return {
                        data: response.data.data,
                        success: true,
                        error: null,
                        message:
                            response.data.message ||
                            'Hives fetched successfully!',
                    }
                }
            } catch (err: any) {
                const apiError: ApiError = err.response?.data || {
                    detail: 'Unknown error',
                }
                return {
                    data: null,
                    success: false,
                    error: apiError,
                    message: apiError.detail || 'Hive fetch failed.',
                }
            } finally {
                this.isLoading = false
            }
        },

        async createHive(
            payload: CreateHivePayload
        ): Promise<ApiResponse<Hive> | undefined> {
            this.isLoading = true
            this.error = null
            try {
                const response = await api.post<ApiResponse<HiveResponse>>(
                    '/hive/',
                    payload
                )
                if (response.data) {
                    const newHive = response.data.data as Hive
                    this.hives.push(newHive)
                    return {
                        data: newHive,
                        success: true,
                        message:
                            response.data.message ||
                            'Hive created successfully!',
                    }
                }
            } catch (err: any) {
                const apiError: ApiError = err.response?.data || {
                    detail: 'Unknown error',
                }
                return {
                    data: null,
                    success: false,
                    error: apiError,
                    message: apiError.detail || 'Hive creation failed.',
                }
            } finally {
                this.isLoading = false
            }
        },

        async updateHive(
            id: number,
            payload: Partial<CreateHivePayload>
        ): Promise<ApiResponse<Hive> | undefined> {
            try {
                const response = await api.put<ApiResponse<HiveResponse>>(
                    `/hive/${id}/`,
                    payload
                )
                if (response.data?.data) {
                    const updatedHive = response.data.data as Hive
                    this.hives = this.hives.map((h) =>
                        h.id === id ? updatedHive : h
                    )
                    return { data: updatedHive, success: true }
                }
            } catch (err: any) {
                const apiError: ApiError = err.response?.data || {
                    detail: 'Unknown error',
                }
                return {
                    data: null,
                    success: false,
                    error: apiError,
                    message: apiError.detail || 'Hive update failed.',
                }
            }
        },

        async deleteHive(id: number): Promise<ApiResponse<null> | undefined> {
            try {
                await api.delete(`/hive/${id}/`)
                this.hives = this.hives.filter((h) => h.id !== id)
                delete this.hiveTasks[id]
                return {
                    data: null,
                    success: true,
                    message: 'Hive deleted successfully!',
                }
            } catch (err: any) {
                const apiError: ApiError = err.response?.data || {
                    detail: 'Unknown error',
                }
                return {
                    data: null,
                    success: false,
                    error: apiError,
                    message: apiError.detail || 'Hive deletion failed.',
                }
            }
        },

        async addTask(
            payload: AddTaskPayload & { hive: number }
        ): Promise<ApiResponse<Task> | undefined> {
            if (!this.currentHiveId) {
                return {
                    data: null,
                    success: false,
                    error: { detail: 'No active hive selected.' },
                    message: 'You must select a hive before adding a task.',
                }
            }

            const taskPayload: AddTaskPayload & { hive: number } = {
                ...payload,
                hive: this.currentHiveId,
            }

            this.isLoading = true
            this.error = null

            try {
                const response = await api.post<ApiResponse<Task>>(
                    '/task/',
                    taskPayload
                )
                const createdTask = response.data?.data

                if (createdTask) {
                    this.hiveTasks[this.currentHiveId] ||= []
                    this.hiveTasks[this.currentHiveId].push(createdTask)

                    return {
                        data: createdTask,
                        success: true,
                        message:
                            response.data?.message ||
                            'Task created successfully!',
                    }
                }
            } catch (err: any) {
                const apiError: ApiError = err.response?.data || {
                    detail: 'Unknown error',
                }
                return {
                    data: null,
                    success: false,
                    error: apiError,
                    message: apiError.detail || 'Task creation failed.',
                }
            } finally {
                this.isLoading = false
            }
        },
        async updateTask(
            id: number,
            payload: Partial<AddTaskPayload>
        ): Promise<ApiResponse<Task> | undefined> {
            try {
                const response = await api.patch<ApiResponse<Task>>(
                    `/task/${id}/`,
                    payload
                )
                console.log('API Response:', response)

                if (response?.data?.data) {
                    const updatedTask = response.data.data
                    const tasks = this.hiveTasks[updatedTask.hive] || []
                    this.hiveTasks[updatedTask.hive] = tasks.map((t) =>
                        t.id === id ? updatedTask : t
                    )
                    return { data: updatedTask, success: true }
                } else {
                    console.warn(
                        'API Response does not contain expected data field.'
                    )
                    return {
                        data: null,
                        success: false,
                        message: 'No data returned',
                    }
                }
            } catch (err: any) {
                console.error('Error during task update:', err)
                const apiError: ApiError = err.response?.data || {
                    detail: 'Unknown error',
                }
                return {
                    data: null,
                    success: false,
                    error: apiError,
                    message: apiError.detail || 'Task update failed.',
                }
            }
        },
        async deleteTask(
            id: number,
            hiveId: number
        ): Promise<ApiResponse<null> | undefined> {
            try {
                await api.delete(`/task/${id}/`)
                this.hiveTasks[hiveId] = (this.hiveTasks[hiveId] || []).filter(
                    (t) => t.id !== id
                )
                return {
                    data: null,
                    success: true,
                    message: 'Task deleted successfully!',
                }
            } catch (err: any) {
                const apiError: ApiError = err.response?.data || {
                    detail: 'Unknown error',
                }
                return {
                    data: null,
                    success: false,
                    error: apiError,
                    message: apiError.detail || 'Task deletion failed.',
                }
            }
        },
        async inviteMember(
            username: string
        ): Promise<ApiResponse<null> | undefined> {
            try {
                const payload = {
                    username,
                    hive: this.currentHiveId,
                }

                await api.post('/hive/invite_member/', payload)

                return {
                    data: null,
                    success: true,
                    message: 'Member invited successfully!',
                }
            } catch (err: any) {
                const apiError: ApiError = err.response?.data || {
                    detail: 'Unknown error',
                }
                return {
                    data: null,
                    success: false,
                    error: apiError,
                    message: apiError.detail || 'Member invitation failed.',
                }
            }
        },
        async removeMemberFromHive(
            hiveId: number,
            userId: number
        ): Promise<ApiResponse<null> | undefined> {
            try {
                await api.delete(`/hive/${hiveId}/member/${userId}/`)

                const hive = this.hives.find((h) => h.id === hiveId)
                if (hive) {
                    hive.members = hive.members.filter(
                        (member) => member.user.id !== userId
                    )
                }

                return {
                    data: null,
                    success: true,
                    message: 'Member removed successfully!',
                }
            } catch (err: any) {
                const apiError: ApiError = err.response?.data || {
                    detail: 'Unknown error',
                }
                return {
                    data: null,
                    success: false,
                    error: apiError,
                    message: apiError.detail || 'Failed to remove member.',
                }
            }
        },
        async updateMemberRole(
            hiveId: number,
            userId: number,
            newRole: 'QB' | 'BK' | 'WB'
        ) {
            try {
                console.log('Sending PATCH request...')
                const response = await api.patch(
                    `/hive/${hiveId}/set_role/${userId}/`,
                    { role: newRole }
                )

                console.log('Got response:', response)

                // Update the local store
                const hive = this.hives.find((h) => h.id === hiveId)
                const member = hive?.members.find((m) => m.user.id === userId)
                if (member) {
                    member.role = newRole
                }

                return response
            } catch (error) {
                console.error('Error updating member role:', error)
                throw error
            }
        },
    },
})
