// stores/userStore.ts
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
        async login(credentials: LoginPayload) {
            try {
                await api.get('/auth/csrf/')
                const res = await api.post<ApiResponse<AuthResponse>>(
                    '/auth/login/',
                    credentials
                )
                if (res.data.data?.user) this.user = res.data.data?.user
                return res.data
            } catch (err: any) {
                throw err.response?.data || err
            }
        },

        async register(data: RegisterPayload) {
            try {
                const res = await api.post<ApiResponse<AuthResponse>>(
                    '/auth/',
                    data
                )
                return res.data
            } catch (err: any) {
                throw err.response?.data || err
            }
        },
    },
})
