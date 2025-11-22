import { App, Editor, MarkdownView, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { AINoteSettings, DEFAULT_SETTINGS } from './src/settings';
import { getEmbeddedFiles } from './src/utils/file-processing';
import { uploadFile, waitForFileActive, generateContent } from './src/services/gemini';

export default class AINoteEnhancerPlugin extends Plugin {
	settings: AINoteSettings;

	async onload() {
		await this.loadSettings();

		// Add command to enhance note with AI
		this.addCommand({
			id: 'enhance-note-with-ai',
			name: 'Enhance Note with AI',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				await this.enhanceNote(editor, view);
			}
		});

		// Add settings tab
		this.addSettingTab(new AINoteSettingTab(this.app, this));
	}

	async enhanceNote(editor: Editor, view: MarkdownView) {
		// Check if API key is configured
		if (!this.settings.apiKey) {
			new Notice('Please configure your Gemini API key in settings');
			return;
		}

		const file = view.file;
		if (!file) {
			new Notice('No active file');
			return;
		}

		try {
			new Notice('Processing note and attachments...');

			// Get note content
			const noteContent = editor.getValue();

			// Get embedded files
			const embeddedFiles = await getEmbeddedFiles(this.app, file);

			if (embeddedFiles.length > 0) {
				new Notice(`Found ${embeddedFiles.length} attachment(s), uploading...`);
			}

			// Upload files and wait for them to be ready
			const fileData = [];
			const failedFiles = [];

			for (const embeddedFile of embeddedFiles) {
				try {
					new Notice(`Uploading ${embeddedFile.file.name}...`);
					const uploadedFile = await uploadFile(embeddedFile, this.settings.apiKey);

					// Wait for file to be processed
					new Notice(`Processing ${embeddedFile.file.name}...`);
					await waitForFileActive(uploadedFile.uri, this.settings.apiKey);

					fileData.push({
						fileUri: uploadedFile.uri,
						mimeType: embeddedFile.mimeType
					});
				} catch (error: any) {
					failedFiles.push(embeddedFile.file.name);
					const errorMsg = error?.message || error?.toString() || 'Unknown error';
					new Notice(`Failed to process ${embeddedFile.file.name}: ${errorMsg}`, 5000);
					console.error('File processing error:', error);
				}
			}

			// Check if we should continue
			if (embeddedFiles.length > 0 && fileData.length === 0) {
				throw new Error('All file uploads failed. Cannot proceed with enhancement.');
			}

			if (failedFiles.length > 0) {
				new Notice(`Warning: ${failedFiles.length} file(s) failed to upload. Continuing with ${fileData.length} successful file(s)...`, 5000);
			}

			// Generate enhanced content
			new Notice('Generating enhanced content...');
			const enhancedContent = await generateContent(
				noteContent,
				fileData,
				this.settings.apiKey,
				this.settings.modelName
			);			// Append the enhanced content to the note
			const lastLine = editor.lastLine();
			const separator = '\n\n---\n\n## AI Enhanced Content\n\n';
			editor.replaceRange(separator + enhancedContent, { line: lastLine + 1, ch: 0 });

			new Notice('Note enhanced successfully!');
		} catch (error: any) {
			const errorMsg = error?.message || error?.toString() || 'Unknown error';
			new Notice(`Error: ${errorMsg}`);
			console.error('Enhancement error:', error);
		}
	}

	onunload() {
		// Cleanup if needed
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class AINoteSettingTab extends PluginSettingTab {
	plugin: AINoteEnhancerPlugin;

	constructor(app: App, plugin: AINoteEnhancerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'AI Note Enhancer Settings' });

		new Setting(containerEl)
			.setName('Gemini API Key')
			.setDesc('Enter your Google Gemini API key')
			.addText(text => text
				.setPlaceholder('Enter API key')
				.setValue(this.plugin.settings.apiKey)
				.onChange(async (value) => {
					this.plugin.settings.apiKey = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Model Name')
			.setDesc('Gemini model to use (e.g., gemini-1.5-pro, gemini-1.5-flash)')
			.addText(text => text
				.setPlaceholder('gemini-1.5-pro')
				.setValue(this.plugin.settings.modelName)
				.onChange(async (value) => {
					this.plugin.settings.modelName = value;
					await this.plugin.saveSettings();
				}));
	}
}
