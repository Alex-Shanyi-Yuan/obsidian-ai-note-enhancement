export interface AINoteSettings {
    apiKey: string;
    modelName: string;
}

export const DEFAULT_SETTINGS: AINoteSettings = {
    apiKey: '',
    modelName: 'gemini-1.5-pro'
}
