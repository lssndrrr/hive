export type Status = 'TD' | 'IP' | 'D' | 'OD'

export interface Task {
    id: number
    name: string
    assignee: number | null
    status: Status
    due_date: string
    created_on: string
    hive: number
    created_by: number
}

export interface TaskResponse {
    tasks: Task[]
}
