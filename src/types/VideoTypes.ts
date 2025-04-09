export type InsertedVideoType = {
    message: string,
    videoID: string
}

export type Video = {
    id: number,
    requested_by_ip: string,
    title: string,
    updated_at: Date,
    created_at: Date,
    video_id: string,
    user_id: number,
}

export type ProcessingStatus = {
    created_at: Date,
    id: number,
    path: string,
    resolution: string,
    status: string,
    updated_at: Date,
    video_id: string
}