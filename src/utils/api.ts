import axios from "axios"
import { ErrorType } from "../types/Error"
import { LoginResponse, User } from "@/types/AuthTypes";
import { getStorage } from "@/lib/storage";
import { InsertedVideoType, ProcessingStatus, Video } from "@/types/VideoTypes";

const API_URL = import.meta.env.VITE_API_URL

axios.defaults.validateStatus = status => status >= 200 && status <= 500;

export async function Login({ username, password }: { username: string; password: string }) {
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

    if (response.status === 200) {
        return response.data as LoginResponse
    }

    return {
        error: response.data.error,
        statusCode: response.status,
    } as ErrorType
}

// Get the current user from the JWT token
export async function GetUser() {
    const token = getStorage("token")
    if (!token) {
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
    if (response.status !== 200) {
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

export async function GetUsers() {
    const token = getStorage("token")
    if (!token) {
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
    if (response.status !== 200) {
        return {
            error: response.data.error,
            statusCode: response.status,
        } as ErrorType
    }
    return response.data as User[]
}

export async function DeleteUser({ user, forceDelete }: { user: User, forceDelete: boolean }) {
    const token = getStorage("token")
    if (!token) {
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
    if (response.status !== 200) {
        return {
            error: response.data.error,
            statusCode: response.status,
        } as ErrorType
    }
    return {
        success: true,
    }
}

export async function CreateUser({ username, password, role, active }: { username: string, password: string, role: "admin" | "guest", active?: boolean | undefined }) {
    const token = getStorage("token")
    if (!token) {
        return {
            error: "No token found",
            statusCode: 401,
        } as ErrorType
    }
    if (active === undefined || active === null) {
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
    if (response.status !== 200) {
        return {
            error: response.data.error,
            statusCode: response.status,
        } as ErrorType
    }
    return {
        message: response.data.message,
    }
}

export async function UpdateUser({ user }: { user: User }) {
    const token = getStorage("token")
    if (!token) {
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
    if (response.status !== 200) {
        return {
            error: response.data.error,
            statusCode: response.status,
        } as ErrorType
    }
    return {
        message: response.data.message,
    }
}

export async function GetUserById(id: string) {
    const token = getStorage("token")
    if (!token) {
        return {
            error: "No token found",
            statusCode: 401,
        } as ErrorType
    }
    const response = await axios({
        method: "GET",
        url: API_URL + "users/" + id,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        }
    })
    if (response.status !== 200) {
        return {
            error: response.data.error,
            statusCode: response.status,
        } as ErrorType
    }
    return response.data as User
}

export async function InsertVideo(url: string) {
    const token = getStorage("token")
    if (!token) {
        return {
            error: "No token found",
            statusCode: 401,
        } as ErrorType
    }
    const response = await axios({
        method: "POST",
        url: API_URL + "videos/",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        data: {
            url: url
        },
    })

    if (response.status === 409) {
        return {
            message: response.data.error,
            videoID: response.data.videoID,
        } as InsertedVideoType
    }

    if (response.status !== 200) {
        return {
            error: response.data.error,
            statusCode: response.status,
        } as ErrorType
    }

    return response.data as InsertedVideoType
}

export async function GetVideoByID(videoID: string | null) {
    if (!videoID) {
        return null
    }
    const token = getStorage("token")
    if (!token) {
        return {
            error: "No token found",
            statusCode: 401,
        } as ErrorType
    }
    const response = await axios({
        method: "GET",
        url: API_URL + "videos/" + videoID,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        }
    })

    if (response.status !== 200) {
        return {
            error: response.data.error,
            statusCode: response.status,
        } as ErrorType
    }

    return response.data as Video
}

export async function GetVideoResolutions(videoID: string){
    const token = getStorage("token")
    if (!token) {
        return {
            error: "No token found",
            statusCode: 401,
        } as ErrorType
    }
    const response = await axios({
        method: "GET",
        url: API_URL + "videos/" + videoID + "/formats",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        }
    })

    if (response.status !== 200) {
        return {
            error: response.data.error,
            statusCode: response.status,
        } as ErrorType
    }

    return response.data
}

export async function ProcessVideoMP3(videoID: string) {
    const token = getStorage("token")
    if (!token) {
        return {
            error: "No token found",
            statusCode: 401,
        } as ErrorType
    }
    const response = await axios({
        method: "POST",
        url: API_URL + "videos/" + videoID + "/process",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token, 
        }  ,
        data: {
            Resolution: "any",
            IsAudio: true 
        }
    })
    if (response.status!== 200) {
        return {
            error: response.data.error,
            statusCode: response.status,
        } as ErrorType 
    }
    return response.data
}

export async function ProcessVideoMP4(videoID: string, resolution: string) {
    const token = getStorage("token")
    if (!token) {
        return {
            error: "No token found",
            statusCode: 401,
        } as ErrorType
    }
    const response = await axios({
        method: "POST",
        url: API_URL + "videos/" + videoID + "/process",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token, 
        }  ,
        data: {
            Resolution: resolution,
            IsAudio: false 
        }
    })
    if (response.status!== 200) {
        return {
            error: response.data.error,
            statusCode: response.status,
        } as ErrorType 
    }
    return response.data
}

export async function GetVideoProcessingStatus(videoID: string) {
    const token = getStorage("token")
    if (!token) {
        return {
            error: "No token found",
            statusCode: 401,
        } as ErrorType
    }
    const response = await axios({
        method: "GET",
        url: API_URL + "videos/" + videoID + "/status", 
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        }
    })
    if (response.status!== 200) {
        return {
            error: response.data.error,
            statusCode: response.status,
        } as ErrorType 
    }
    return response.data as ProcessingStatus[]
}

export async function DownloadProcessedVideo(videoID: string, format: "MP3"|"MP4"|null, resolution:string){
    const token = getStorage("token")
    if (!token) {
        return {
            error: "No token found",
            statusCode: 401,
        } as ErrorType
    }

    const queryResolution = format === "MP3" ? "mp3" : resolution;
    
    const response = await axios({
        method: "GET",
        url: `${API_URL}videos/${videoID}/download?resolution=${queryResolution}`,
        headers: {
            "Authorization": "Bearer " + token,
        },
        responseType: 'blob'
    });

    if (response.status !== 200) {
        return {
            error: "Download failed",
            statusCode: response.status,
        } as ErrorType
    }

    // Create download link, a little bit messy, I know
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `video.${format?.toLowerCase()}`; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    return { success: true };
}