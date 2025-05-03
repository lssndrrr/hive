export interface ApiResponse<T> {
    data: T | null
    error?: ApiError | null
    message?: string
}

export interface ApiError {
    detail?: string
    [key: string]: string[] | string | undefined
}

export interface User {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
    date_joined: string
}
