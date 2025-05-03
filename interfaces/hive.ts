export interface Hive {
    id: number
    name: string
    description: string
    members: HiveMember[] // Optional: included in response
}

export interface HiveMember {
    id: number
    username: string
    email: string
    role: 'QB' | 'BK' | 'WORKER_BEE'
    joined_on: string
}

export interface HiveResponse {
    id: number
    name: string
    description: string
    members: HiveMember[]
}
