import axios from "axios"
import { ErrorType } from "../types/Error"
import { LoginResponse, User } from "@/types/AuthTypes";
import { getStorage } from "@/lib/storage";
import { InsertedVideoType, ProcessingStatus, Video } from "@/types/VideoTypes";
import { CookieStatusType } from "@/types/CookiesTypes";

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

export async function GetVideoResolutions(videoID: string, cookiesFile?: File) {
    const token = getStorage("token")
    if (!token) {
      return {
        error: "No token found",
        statusCode: 401,
      } as ErrorType
    }
  
    if (cookiesFile) {
      // Crear FormData y anexar el archivo cookies
      const formData = new FormData()
      formData.append("cookies", cookiesFile)
  
      const response = await axios.post(
        API_URL + "videos/" + videoID + "/formats",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + token,
          },
        }
      )
  
      if (response.status !== 200) {
        return {
          error: response.data.error,
          statusCode: response.status,
        } as ErrorType
      }
      return response.data
    } else {
      // No hay archivo cookies, mandar GET sin body ni Content-Type
      const response = await axios.get(API_URL + "videos/" + videoID + "/formats", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
  
      if (response.status !== 200) {
        return {
          error: response.data.error,
          statusCode: response.status,
        } as ErrorType
      }
      return response.data
    }
  }
  

export async function ProcessVideoMP3(videoID: string, cookiesFile?: File) {
    const token = getStorage("token")
    if (!token) {
      return {
        error: "No token found",
        statusCode: 401,
      } as ErrorType
    }
  
    const formData = new FormData()
    formData.append("Resolution", "any")
    formData.append("IsAudio", "true")
    if (cookiesFile) {
      formData.append("cookies", cookiesFile)
    }
  
    try {
      const response = await axios.post(
        `${API_URL}videos/${videoID}/process`,
        formData,
        {
          headers: {
            "Authorization": "Bearer " + token,
          },
        }
      )
  
      if (response.status !== 200) {
        return {
          error: response.data.error,
          statusCode: response.status,
        } as ErrorType
      }
  
      return response.data
  
    } catch (err: any) {
      return {
        error: err.response?.data?.error || "Unknown error",
        statusCode: err.response?.status || 500,
      } as ErrorType
    }
  }
  

  export async function ProcessVideoMP4(videoID: string, resolution: string, cookiesFile?: File) {
    const token = getStorage("token")
    if (!token) {
        return {
            error: "No token found",
            statusCode: 401,
        } as ErrorType
    }

    const formData = new FormData()
    formData.append("Resolution", resolution)
    formData.append("IsAudio", "false")
    if (cookiesFile) {
        formData.append("cookies", cookiesFile)
    }

    try {
        const response = await axios.post(
            `${API_URL}videos/${videoID}/process`,
            formData,
            {
                headers: {
                    "Authorization": "Bearer " + token,
                }
            }
        )

        if (response.status !== 200) {
            return {
                error: response.data.error,
                statusCode: response.status,
            } as ErrorType
        }

        return response.data
    } catch (err: any) {
        return {
            error: err.response?.data?.error || "Unknown error",
            statusCode: err.response?.status || 500,
        } as ErrorType
    }
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
    if (response.status !== 200) {
        return {
            error: response.data.error,
            statusCode: response.status,
        } as ErrorType
    }
    return response.data as ProcessingStatus[]
}

export async function DownloadProcessedVideo(videoID: string, format: "MP3" | "MP4" | null, resolution: string) {
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

export async function GetVideosByUserId(userID: string) {
    const token = getStorage("token")
    if (!token) {
        return {
            error: "No token found",
            statusCode: 401,
        } as ErrorType
    }
    const response = await axios({
        method: "GET",
        url: API_URL + "users/" + userID + "/videos",
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
    return response.data as Video[]
}

export async function DeleteVideoById(videoID: string) {
    const token = getStorage("token")
    if (!token) {
        return {
            error: "No token found",
            statusCode: 401,
        } as ErrorType
    }
    const response = await axios({
        method: "DELETE",
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
    return {
        message: response.data.message
    }
}

export async function GetVideos() {
    const token = getStorage("token")
    if (!token) {
        return {
            error: "No token found",
            statusCode: 401,
        } as ErrorType
    }
    const response = await axios({
        method: "GET",
        url: API_URL + "videos/",
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
    console.log(response.data)
    return response.data as Video[]
}

export async function CheckApiStatus() {
    try {
        const response = await fetch(API_URL + "status");
        if (response.ok) {
            return {
                active: true
            }
        } else {
            return {
                active: false
            }
        }
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : "API not available";
        return {
            active: false,
            error: errorMessage
        }
    }
}

export async function CheckCookiesFile() {
    const token = getStorage("token")
    if (!token) {
        return {
            error: "No token found",
            statusCode: 401,
        } as ErrorType
    }
    const response = await axios({
        method: "GET",
        url: API_URL + "cookies",
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
    return response.data as CookieStatusType
}

export async function DeleteCookiesFile() {
    const token = getStorage("token")
    if (!token) {
        return {
            error: "No token found",
            statusCode: 401,
        } as ErrorType
    }
    const response = await axios({
        method: "DELETE",
        url: API_URL + "cookies",
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
    return response.data as {
        message: string
    }
}

export async function UploadCookiesFile(file: File[]) {
    const token = getStorage("token")
    if (!token) {
        return {
            error: "No token found",
            statusCode: 401,
        } as ErrorType
    }

    const formData = new FormData();
    formData.append("cookies", file[0]);

    const response = await axios.post(API_URL + "cookies", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            "Authorization": "Bearer " + token,
        }
    })
    if (response.status !== 200) {
        return {
            error: response.data.error,
            statusCode: response.status,
        } as ErrorType
    }
    return response.data as {
        message: string
    }
}