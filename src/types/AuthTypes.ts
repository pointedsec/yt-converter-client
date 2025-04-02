export type LoginResponse = {
    token: string,
    error: null
}

export type User = {
    id: number,
    username: string,
    active: boolean,
    password: string,
    role: "admin" | "guest",
    Videos: null
}