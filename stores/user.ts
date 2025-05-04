import { defineStore } from 'pinia'
import api from '~/api/api'
import type { User, ApiResponse, ApiError } from '~/interfaces/common'
import type {
    LoginPayload,
    RegisterPayload,
    AuthResponse,
} from '~/interfaces/auth'

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null as User | null,
    }),

    actions: {
        async login(
            credentials: LoginPayload
        ): Promise<ApiResponse<AuthResponse>> {
            try {
                await api.get('/auth/csrf/')
                const res = await api.post<ApiResponse<AuthResponse>>(
                    '/auth/login/',
                    credentials
                )
                console.log('HERE')
                if (res.data.data?.user) this.user = res.data.data?.user
                return {
                    data: res.data.data,
                    success: true,
                    error: null,
                    message: res.data.message || 'Login successful!',
                }
            } catch (err: any) {
                const apiError: ApiError = err.response?.data || {
                    detail: 'Unknown error',
                }

                return {
                    data: null,
                    success: false,
                    error: apiError,
                    message: apiError.detail || 'Login failed.',
                }
            }
        },

        async register(
            data: RegisterPayload
        ): Promise<ApiResponse<AuthResponse>> {
            try {
                const res = await api.post<ApiResponse<null>>('/auth/', data)
                return {
                    data: null,
                    success: true,
                    error: null,
                    message:
                        res.data.message || 'User registered successfully!',
                }
            } catch (err: any) {
                const apiError: ApiError = err.response?.data || {
                    detail: 'Unknown error',
                }

                return {
                    data: null,
                    success: false,
                    error: apiError,
                    message: apiError.detail || 'Registration failed.',
                }
            }
        },
        async deleteAccount(): Promise<ApiResponse<null>> {
            try {
                const res = await api.delete<ApiResponse<null>>('/user/me/')

                return {
                    data: null,
                    success: true,
                    error: null,
                    message:
                        res.data.message || 'Account deleted successfully!',
                }
            } catch (err: any) {
                const apiError: ApiError = err.response?.data || {
                    detail: 'Unknown error',
                }

                return {
                    data: null,
                    success: false,
                    error: apiError,
                    message: apiError.detail || 'Account deletion failed.',
                }
            }
        },
        async fetchAccount(
            username: string
        ): Promise<ApiResponse<AuthResponse>> {
            try {
                const res = await api.get<ApiResponse<AuthResponse>>(
                    `/user/${username}`
                )

                if (res.data.data?.user) {
                    this.user = res.data.data.user
                }

                return {
                    data: res.data.data,
                    success: true,
                    error: null,
                    message: res.data.message || 'User fetched successfully',
                }
            } catch (err: any) {
                const apiError: ApiError = err.response?.data || {
                    detail: 'Unknown error',
                }

                return {
                    data: null,
                    success: false,
                    error: apiError,
                    message: apiError.detail || 'Fetch failed',
                }
            }
        },

        async updateUser(
            data: Partial<AuthResponse['user']>
        ): Promise<ApiResponse<AuthResponse>> {
            try {
                // await api.get('/auth/csrf/')
                const res = await api.patch<ApiResponse<AuthResponse>>(
                    `/user/${this.user?.username}/`,
                    data
                )

                if (res.data.data?.user) {
                    this.user = res.data.data.user
                }

                return {
                    data: res.data.data,
                    success: true,
                    error: null,
                    message: res.data.message || 'User updated successfully',
                }
            } catch (err: any) {
                const apiError: ApiError = err.response?.data || {
                    detail: 'Unknown error',
                }

                return {
                    data: null,
                    success: false,
                    error: apiError,
                    message: apiError.detail || 'Update failed',
                }
            }
        },
    },
})
