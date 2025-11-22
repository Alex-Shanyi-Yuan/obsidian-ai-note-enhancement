import { requestUrl } from 'obsidian';
import { EmbeddedFile } from '../utils/file-processing';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com';

interface UploadedFile {
    name: string;
    uri: string;
    state: 'PROCESSING' | 'ACTIVE' | 'FAILED';
}

interface GeminiFile {
    file: {
        name: string;
        uri: string;
        state: 'PROCESSING' | 'ACTIVE' | 'FAILED';
    };
}

interface FileData {
    fileUri: string;
    mimeType: string;
}

export async function uploadFile(
    file: EmbeddedFile,
    apiKey: string
): Promise<UploadedFile> {
    const uploadUrl = `${GEMINI_API_BASE}/upload/v1beta/files?key=${apiKey}`;

    try {
        const response = await requestUrl({
            url: uploadUrl,
            method: 'POST',
            headers: {
                'Content-Type': file.mimeType,
                'X-Goog-Upload-Protocol': 'raw',
                'X-Goog-Upload-Command': 'upload, finalize',
                'X-Goog-Upload-Header-Content-Type': file.mimeType,
            },
            body: file.data,
        });

        console.log('Upload response:', response);
        console.log('Response JSON:', response.json);

        const responseData = response.json as any;

        // Handle both possible response structures
        let uploadedFile: UploadedFile;
        if (responseData.file) {
            // Response has a 'file' wrapper
            uploadedFile = responseData.file;
        } else if (responseData.name && responseData.uri) {
            // Response is directly the file object
            uploadedFile = responseData;
        } else {
            console.error('Unexpected response structure:', responseData);
            throw new Error('Upload succeeded but response structure is invalid');
        }

        if (!uploadedFile || !uploadedFile.uri) {
            throw new Error('Upload succeeded but no file URI was returned');
        }

        console.log('Extracted file info:', uploadedFile);
        return uploadedFile;
    } catch (error: any) {
        console.error('Failed to upload file:', error);
        console.error('Error details:', {
            status: error?.status,
            text: error?.text,
            message: error?.message
        });
        const errorMsg = error?.message || error?.toString() || 'Unknown error';
        throw new Error(`Failed to upload ${file.file.name}: ${errorMsg}`);
    }
}

export async function waitForFileActive(
    fileUri: string,
    apiKey: string,
    maxWaitMs = 60000
): Promise<void> {
    const pollInterval = 2000; // Check every 2 seconds
    const startTime = Date.now();

    if (!fileUri) {
        throw new Error('Invalid file URI: URI is empty or undefined');
    }

    // Extract file name from URI (format: files/xyz)
    const fileName = fileUri.split('/').pop();
    const checkUrl = `${GEMINI_API_BASE}/v1beta/files/${fileName}?key=${apiKey}`;

    while (Date.now() - startTime < maxWaitMs) {
        try {
            const response = await requestUrl({
                url: checkUrl,
                method: 'GET',
            });

            const fileData = response.json as UploadedFile;

            if (fileData.state === 'ACTIVE') {
                return;
            }

            if (fileData.state === 'FAILED') {
                throw new Error('File processing failed');
            }

            // Still PROCESSING, wait before next check
            await new Promise(resolve => setTimeout(resolve, pollInterval));
        } catch (error: any) {
            console.error('Error checking file status:', error);
            const errorMsg = error?.message || error?.toString() || 'Unknown error';
            throw new Error(`Error checking file status: ${errorMsg}`);
        }
    }

    throw new Error('Timeout waiting for file to become active');
}

export async function generateContent(
    noteContent: string,
    fileData: FileData[],
    apiKey: string,
    modelName: string
): Promise<string> {
    const generateUrl = `${GEMINI_API_BASE}/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    // Build the parts array with text and file references
    const parts: Array<{ text?: string; fileData?: FileData }> = [
        {
            text: `Please proofread and enhance the following draft note. For any audio files, generate well-structured notes with clear sections, summaries, and key points. Integrate information from all attachments (images, PDFs, audio) to create comprehensive, well-organized content.\n\nDraft Note:\n${noteContent}`
        }
    ];

    // Add file references
    for (const file of fileData) {
        parts.push({ fileData: file });
    }

    const requestBody = {
        contents: [{
            parts
        }]
    };

    try {
        const response = await requestUrl({
            url: generateUrl,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const result = response.json as any;

        // Extract text from the response
        if (result.candidates && result.candidates.length > 0) {
            const candidate = result.candidates[0];
            if (candidate.content && candidate.content.parts) {
                return candidate.content.parts
                    .map((part: any) => part.text || '')
                    .join('');
            }
        }

        throw new Error('No content generated');
    } catch (error: any) {
        console.error('Failed to generate content:', error);
        const errorMsg = error?.message || error?.toString() || 'Unknown error';
        throw new Error(`Failed to generate content: ${errorMsg}`);
    }
}
