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

export interface AddTaskPayload {
    name: string
    description: string
    assignee: number | null
    due_date: string
    status: Status
    priority: Priority
}
