import axios from "axios"
import { ErrorType } from "../types/Error"
import { LoginResponse, User} from "@/types/AuthTypes";
import { getStorage } from "@/lib/storage";

const API_URL = import.meta.env.VITE_API_URL

axios.defaults.validateStatus = status => status >= 200 && status <= 500;

export async function Login({ username, password }: { username: string; password: string }){
    const response = await axios({
        method: "POST",
        url: API_URL + "auth/login",
        headers: {
            "Content-Type": "application/json",
        },
        data: {
            username,
            password,
        }
    });

    if (response.status === 200){
        return response.data as LoginResponse
    }

    return {
        error: response.data.error,
        statusCode: response.status,
    } as ErrorType
}

export async function GetUser(){
    const token = getStorage("token")
    if (!token){
        return {
            error: "No token found",
            statusCode: 401,
        } as ErrorType
    }
    const response = await axios({
        method: "GET",
        url: API_URL + "users/me",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
    })
    if (response.status !== 200){
        return {
            error: response.data.error,
            statusCode: response.status,
        } as ErrorType
    }
    const data = await response.data
    return {
        id: data.User.id,
        username: data.User.username,
        active: data.User.active,
        password: data.User.password,
        role: data.User.role,
        Videos: data.Videos

    } as User
}

export async function GetUsers(){
    const token = getStorage("token")
    if (!token){
        return {
            error: "No token found",
            statusCode: 401,
        } as ErrorType
    }
    const response = await axios({
        method: "GET",
        url: API_URL + "users", 
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token, 
        }
    })
    if (response.status !== 200){
        return {
            error: response.data.error,
            statusCode: response.status,
        } as ErrorType 
    }
    return response.data as User[]
}

export async function DeleteUser({user, forceDelete}: {user:User, forceDelete: boolean}){
    const token = getStorage("token")
    if (!token){
        return {
            error: "No token found",
            statusCode: 401,
        } as ErrorType
    }
    const response = await axios({
        method: "DELETE",
        url: API_URL + "users/" + user.id + "?forceDelete=" + forceDelete, 
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        }
    })
    if (response.status!== 200){
        return {
            error: response.data.error,
            statusCode: response.status,
        } as ErrorType 
    }
    return {
        success: true,
    }
}

export async function CreateUser({username, password, role, active}: {username: string, password: string, role: "admin" | "guest", active?: boolean|undefined}){
    const token = getStorage("token")
    if (!token){
        return {
            error: "No token found",
            statusCode: 401,
        } as ErrorType
    } 
    if (active === undefined || active === null){
        active = true
    }
    const response = await axios({
        method: "POST",
        url: API_URL + "users",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token, 
        },
        data: {
            username,
            password,
            role,
            active
        }
    })
    if (response.status!== 200){
        return {
            error: response.data.error,
            statusCode: response.status,
        } as ErrorType 
    }
    return {
        message: response.data.message,
    }
}

export async function UpdateUser({user}: {user: User}){
    const token = getStorage("token")
    if (!token){
        return {
            error: "No token found",
            statusCode: 401,
        } as ErrorType
    } 
    const response = await axios({
        method: "PUT",
        url: API_URL + "users/" + user.id,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        data: {
            username: user.username,
            password: user.password,
            role: user.role,
            active: user.active,
        } 
    })
    if (response.status!== 200){
        return {
            error: response.data.error,
            statusCode: response.status,
        } as ErrorType
    }
    return {
        message: response.data.message,
    }
}