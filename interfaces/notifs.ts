export interface Notification {
    id: number
    recipient: number // or User object if expanded
    message: string
    type: 'GEN' | 'INV' | 'REM'
    created_at: string 
    is_read: boolean
    invitation_id?: number
    data?: {
        hiveId?: number
        hiveName?: string
    }
}
