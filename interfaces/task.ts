export type Status = 'TD' | 'IP' | 'D' | 'OD'
export type Priority = 'H' | 'M' | 'L'

export interface Task {
    id: number
    name: string
    description: string
    assignee: number | null
    status: Status
    priority: Priority
    due_date: string
    created_on: string
    hive: number
    created_by: number
}

export interface TaskResponse {
    tasks: Task[]
}

export interface NewTask {
    name: string
    description: string
    assignee: number | null
    date: Date | undefined
    status: Status
    priority: Priority
    hive: number
    created_by: number
}
