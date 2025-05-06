// stores/useTaskStore.ts
import { defineStore } from 'pinia'
import api from '~/api/api'
import type { Hive, HiveResponse, HiveMember } from '~/interfaces/hive'
import type { Task } from '~/interfaces/task'
import type { ApiResponse, ApiError } from '~/interfaces/common'

interface CreateHivePayload {
    name: string;
    description?: string;
}

interface HiveCreateSuccessResponse {
    message: string;
    data: HiveResponse; // Or Hive if they are the same/compatible
}

export const useHiveStore = defineStore('hive', {
    state: () => ({
        hives: [] as Hive[],
        currentHiveId: null as number | null,
        hiveTasks: {} as Record<number, Task[]>,
        isLoading: false,
        error: null as string | null,
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

        async createHive(payload: CreateHivePayload): Promise<Hive | null> {
            this.isLoading = true;
            this.error = null;
            try {
                const response = await api.post<HiveCreateSuccessResponse>('/hives/', payload); // Verify endpoint

                // --- CORRECTED SUCCESS CHECK ---
                // Check if the response contains the expected 'data' field from the backend
                if (response.data?.data) {
                    const newHiveData = response.data.data;
                    // Assuming HiveResponse structure matches or is compatible with Hive type used in state
                    const newHive = newHiveData as Hive;
                    this.hives.push(newHive);
                    console.log("Hive pushed to store state:", this.hives); // Debug log
                    return newHive; // Return the created hive object
                } else {
                    // Handle cases where the request succeeded (2xx) but the expected 'data' field is missing
                    this.error = response.data?.message || 'Hive creation response structure was unexpected.';
                    console.warn('Hive creation response missing nested data field:', response.data);
                    return null;
                }
            } catch (err: any) {
                console.error("Error creating hive in store:", err);
                const apiError = err;
                let errorMessage = 'An unexpected error occurred during hive creation.';

                if (err.response && err.response.data) {
                    const errorData = err.response.data;
                    if (typeof errorData === 'string') { /* ... */ }
                    else if (Array.isArray(errorData)) { /* ... */ }
                    else if (typeof errorData === 'object' && errorData !== null) { /* ... */ }
                } else if (err.message) { /* ... */ }

                this.error = errorMessage;
                return null;
            } finally {
                this.isLoading = false;
            }
        },

        getTasksForHive(hiveId: number): Task[] {
            return this.hiveTasks[hiveId] || []
        },

        getMembers(hiveId: number): HiveMember[] {
            return this.hives.find((h) => h.id === hiveId)?.members || []
        },
    },
})
