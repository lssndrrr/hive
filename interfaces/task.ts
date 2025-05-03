export type Status = 'TD' | 'IP' | 'D' | 'OD'
export type Priority = 'H' | 'M' | 'L'

export interface Task {
    id: number
    name: string
    assignee: number | null
    description: string
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
