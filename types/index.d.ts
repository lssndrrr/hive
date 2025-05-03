export interface Assignee {
    name?: string;
    avatarUrl?: string | null;
}
export interface Task {
    id: string | number;
    title?: string;
    date?: string | Date;
    hive?: string;
    assignee?: Assignee;
    status?: 'todo' | 'inprogress' | 'done' | string;
}
export interface Member {
    id: string | number;
    name: string;
    avatarUrl?: string | null;
}