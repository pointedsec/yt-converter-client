export type LoginResponse = {
    token: string,
    error: null
}

export type User = {
    id: string, // ik, this should be a number
    username: string,
    active: boolean|undefined,
    password: string,
    role: "admin" | "guest",
    Videos: null,
    created_at: Date,
    updated_at: Date,
    last_login_at: Date
}