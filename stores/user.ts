import { defineStore } from 'pinia'
import api from '~/api/api'
import type { User, ApiResponse, ApiError } from '~/interfaces/common'
import type {
    LoginPayload,
    RegisterPayload,
    AuthResponse,
} from '~/interfaces/auth'

import type { Notification } from '~/interfaces/notifs'

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null as User | null,
        notifications: [] as Notification[],
        isLoadingNotifications: false,
        notificationsError: null as string | null
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

        async fetchNotifications() {
            this.isLoadingNotifications = true
            try {
                const response = await api.get('/notif/');
                this.notifications = response.data.map((notif: any) => ({
                    id: notif.id,
                    recipient: notif.recipient,
                    message: notif.message,
                    type: notif.type,
                    created_at: notif.created_at,
                    is_read: notif.is_read,
                    invitation_id: notif.invitation_id,  // Ensure this matches your Django API
                    data: {
                        hiveId: notif.data?.hiveId,
                        hiveName: notif.data?.hiveName
                    }
                }));
                console.log('Fetched notifications:', this.notifications); // Debug log
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
                this.notifications = [];
            } finally {
                this.isLoadingNotifications = false;
            }
            
        },

        async markNotificationAsRead(notificationId: number) {
            try {
              await api.patch(`/notif/${notificationId}/read/`)
              const notification = this.notifications.find(n => n.id === notificationId)
              if (notification) {
                notification.is_read = true
              }
            } catch (error) {
              console.error('Failed to mark notification as read', error)
            }
        },
        
        async respondToInvite(invitationId: number, accept: boolean): Promise<void> {
            try {
                const response = await api.patch(`/invite/${invitationId}/${accept ? 'accept' : 'decline'}/`);
                
                if (response.data) {
                    // Remove the notification from state
                    this.notifications = this.notifications.filter(n => 
                        n.invitation_id !== invitationId
                    );

                    // If accepted, refresh hive data
                    if (accept) {
                        const hiveStore = useHiveStore();
                        await hiveStore.fetchUserHives();
                    }

                    return response.data;
                }
            } catch (error) {
                console.error('Failed to respond to invitation:', error);
                throw error;
            }
        },
    },
    persist: true,
})
