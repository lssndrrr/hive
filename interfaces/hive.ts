import type { User } from '~/interfaces/common'
import type { Task } from '~/interfaces/task'

export interface CreateHivePayload {
    name: string
    description: string
}
export interface Hive {
    id: number
    name: string
    description: string
    members: HiveMember[]
}

export interface HiveMember {
    user: User
    role: 'QB' | 'BK' | 'WB'
    joined_on: string
}

export interface HiveResponse {
    id: number
    name: string
    description: string
    members: HiveMember[]
}

export interface HiveFetchResponse {
    hives: HiveResponse[]
    tasks: Task[]
}
