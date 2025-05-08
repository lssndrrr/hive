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
        async fetchUser() {
            if (this.user) {
                return
            }
            try {
                const res = await api.get('/user/me')
                if (res.data.data?.user) {
                    this.user = res.data.data.user
                } else {
                    console.warn('No user in response:', res.data)
                }
            } catch (error) {
                console.error('Failed to fetch user info:', error)
                this.user = null
            }
        },
        // async fetchUser() {
        // if (this.user) {
        //     return
        // }
        // // Try to fetch user info if not already present
        // try {
        //     const res = await api.get('/user/me') // Fetch user info from API or check cookie
        //     if (res.data.data?.user) {
        //         this.user = res.data.data.user
        //     } else {
        //         console.warn('No user in response:', res.data)
        //     }
        // } catch (error) {
        //     console.error('Failed to fetch user info:', error)
        //     this.user = null
        // }
        // try {
        //     const res = await api.get('/user/me')
        //     if (res.data.data?.user) {
        //         this.user = res.data.data.user
        //     }
        // } catch (error) {
        //     console.error('Failed to refresh user info:', error)
        //     this.user = null
        // }
        // },
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
        async changePassword(current: string, newPassword: string) {
            try {
                const res = await api.post('/user/change_password/', {
                    current_password: current,
                    new_password: newPassword,
                })

                return {
                    success: true,
                    message:
                        res.data.message || 'Password changed successfully.',
                }
            } catch (err: any) {
                const errorMsg =
                    err.response?.data?.detail || 'Password change failed.'
                return {
                    success: false,
                    message: errorMsg,
                }
            }
        },
        async logout(): Promise<ApiResponse<null>> {
            try {
                await api.get('/auth/csrf/')
                const res = await api.post<ApiResponse<null>>('/auth/logout/')

                this.user = null
                useCookie('auth_token').value = null

                useRouter().push('/login')
                window.history.replaceState(null, '', '/login')
                return {
                    data: null,
                    success: true,
                    error: null,
                    message: res.data.message || 'Logout successful!',
                }
            } catch (err: any) {
                const apiError: ApiError = err.response?.data || {
                    detail: 'Logout failed.',
                }

                return {
                    data: null,
                    success: false,
                    error: apiError,
                    message: apiError.detail || 'Logout failed.',
                }
            }
        },
        async updateUser(
            data: Partial<AuthResponse['user']>
        ): Promise<ApiResponse<AuthResponse>> {
            try {
                const { profile, ...userData } = data

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
        async fetchUser() {
            if (this.user?.username) {
                await this.fetchAccount(this.user.username)
            }
        },
        // New action to remove profile picture
        async removeProfilePic(): Promise<ApiResponse<null>> {
            try {
                const res = await api.delete<ApiResponse<null>>(
                    '/user/remove_profile_pic/'
                )

                // If the backend returns success, update the user store to reflect the change
                if (res.data.success && this.user) {
                    this.user.profile = {
                        ...this.user.profile,
                        profile_pic: null, // Remove the profile picture locally
                    }
                }

                return {
                    data: null,
                    success: true,
                    error: null,
                    message:
                        res.data.message ||
                        'Profile picture removed successfully!',
                }
            } catch (err: any) {
                const apiError: ApiError = err.response?.data || {
                    detail: 'Unknown error',
                }

                return {
                    data: null,
                    success: false,
                    error: apiError,
                    message:
                        apiError.detail || 'Profile picture removal failed.',
                }
            }
        },
        // Add to your existing actions in useUserStore
        async updateProfilePic(file: File): Promise<ApiResponse<AuthResponse>> {
            try {
                const formData = new FormData()
                formData.append('profile_pic', file)

                const res = await api.patch<ApiResponse<AuthResponse>>(
                    '/user/update_profile_pic/',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                )

                // Update local user data with new profile pic
                if (res.data.data?.user && this.user) {
                    this.user = {
                        ...this.user,
                        profile: res.data.data.user.profile,
                    }
                }

                return {
                    data: res.data.data,
                    success: true,
                    error: null,
                    message: res.data.message || 'Profile picture updated!',
                }
            } catch (err: any) {
                const apiError: ApiError = err.response?.data || {
                    detail: 'Update failed',
                }

                return {
                    data: null,
                    success: false,
                    error: apiError,
                    message: apiError.detail || 'Profile picture update failed',
                }
            }
        },
        async fetchProfilePic(username: string): Promise<ApiResponse<any>> {
            try {
                // Assuming there's an endpoint for fetching the profile picture
                const res = await api.get<ApiResponse<{ profile_pic: string }>>(
                    `/user/${username}/profile_pic/`
                )

                // If the response includes the profile picture URL, update it in the store
                if (res.data.data?.profile_pic) {
                    if (this.user?.id && this.user?.username) {
                        this.user = {
                            ...this.user,
                            profile: {
                                ...this.user.profile,
                                profile_pic: res.data.data.profile_pic,
                            },
                        }
                    }
                }

                return {
                    data: res.data.data,
                    success: true,
                    error: null,
                    message:
                        res.data.message ||
                        'Profile picture fetched successfully',
                }
            } catch (err: any) {
                const apiError: ApiError = err.response?.data || {
                    detail: 'Unknown error',
                }

                return {
                    data: null,
                    success: false,
                    error: apiError,
                    message:
                        apiError.detail || 'Failed to fetch profile picture',
                }
            }
        },
    },
    persist: true,
})
