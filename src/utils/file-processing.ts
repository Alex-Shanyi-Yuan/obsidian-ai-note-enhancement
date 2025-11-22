import { App, TFile } from 'obsidian';

export interface EmbeddedFile {
    file: TFile;
    data: ArrayBuffer;
    mimeType: string;
}

const MIME_TYPE_MAP: Record<string, string> = {
    'wav': 'audio/wav',
    'mp3': 'audio/mpeg',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'pdf': 'application/pdf'
};

export function getMimeType(extension: string): string | null {
    return MIME_TYPE_MAP[extension.toLowerCase()] || null;
}

export async function getEmbeddedFiles(app: App, file: TFile): Promise<EmbeddedFile[]> {
    const cache = app.metadataCache.getFileCache(file);
    if (!cache || !cache.embeds) {
        return [];
    }

    const embeddedFiles: EmbeddedFile[] = [];

    for (const embed of cache.embeds) {
        // Resolve the link to an actual file
        const linkedFile = app.metadataCache.getFirstLinkpathDest(embed.link, file.path);

        if (!linkedFile) {
            continue;
        }

        // Get file extension
        const extension = linkedFile.extension;
        const mimeType = getMimeType(extension);

        // Only process supported file types
        if (!mimeType) {
            continue;
        }

        try {
            // Read binary data
            const data = await app.vault.readBinary(linkedFile);
            embeddedFiles.push({
                file: linkedFile,
                data,
                mimeType
            });
        } catch (error) {
            console.error(`Failed to read embedded file ${linkedFile.path}:`, error);
        }
    }

    return embeddedFiles;
}
