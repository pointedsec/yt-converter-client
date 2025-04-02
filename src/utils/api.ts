import axios from "axios"
import { ErrorType } from "../types/Error"
import { LoginResponse, User} from "@/types/AuthTypes";
import { getStorage } from "@/lib/storage";

const API_URL = import.meta.env.VITE_API_URL

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
        },
        validateStatus: () => true,
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