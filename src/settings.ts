export interface AINoteSettings {
	apiKey: string;
	modelName: string;
	customPrompt: string;
	includeOriginalContent: boolean;
	outputFormat: "enhanced" | "structured" | "analytical";
}

export const DEFAULT_SETTINGS: AINoteSettings = {
	apiKey: "",
	modelName: "gemini-2.5-pro",
	customPrompt:
		"You are an expert note-taking assistant for Obsidian who specializes in the Linking Your Thinking (LYT) methodology and Zettelkasten principles.\n\nYour task is to analyze the provided draft note and any attached files (images, PDFs, audio transcriptions, etc.) to create comprehensive, well-structured notes.\n\nGuidelines:\n- Create clear hierarchical structure with headings and subheadings\n- Extract and organize key concepts, ideas, and actionable items\n- Identify connections between ideas and suggest potential links to other concepts\n- Include relevant details, quotes, and quantifiable information\n- Use markdown formatting effectively (bold, italics, lists, blockquotes)\n- Add tags for categorization where appropriate\n- If the content warrants it, include a mermaid diagram showing concept relationships\n- Write in first-person perspective as if the user wrote these notes\n- Maintain the intellectual depth while improving clarity and organization\n- Only output the notes without unecessary information\n\nFor audio content specifically:\n- Structure with clear sections, summaries, and key points\n- Capture important details like names, numbers, dates, and specific examples\n- Organize chronologically or thematically as appropriate\n\nProvide enhanced notes that are immediately useful for knowledge management and future reference.",
	includeOriginalContent: false,
	outputFormat: "enhanced",
};
