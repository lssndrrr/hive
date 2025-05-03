import type { User } from '~/interfaces/common'

export interface LoginPayload {
    username: string
    password: string
}

export interface RegisterPayload {
    username: string
    first_name: string
    last_name: string
    email: string
    password: string
}

export interface AuthResponse {
    user: User
}
