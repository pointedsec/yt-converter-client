export function checkIfValidURL(str: string): boolean {
    try {
        new URL(str);
        return true;
    } catch {
        return false;
    }
}

export function checkIfValidYoutubeURL(str: string): boolean{
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/|e\/|shorts\/|live\/)?([A-Za-z0-9_-]{11})/;
    return youtubeRegex.test(str);
}