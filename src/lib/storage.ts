export function getStorage(key: string) {
    return localStorage.getItem(key)
}

export function getStorageTheme(): "dark" | "light" {
    const theme = getStorage("theme")
    if (theme === "dark" || theme === "light") {
        return theme
    }
    return "light"

}

export function setStorage(key: string, value: string) {
    localStorage.setItem(key, value)
}

export function removeStorage(key: string) {
    localStorage.removeItem(key) 
}