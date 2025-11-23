export interface AINoteSettings {
    apiKey: string;
    modelName: string;
}

export const DEFAULT_SETTINGS: AINoteSettings = {
    apiKey: '',
    modelName: 'gemini-2.5-pro'
}
