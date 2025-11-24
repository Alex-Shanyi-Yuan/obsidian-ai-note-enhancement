# AI Note Enhancement Plugin for Obsidian

Transform your draft notes into comprehensive, well-structured knowledge with the power of Google Gemini AI. This plugin analyzes your note content along with embedded files (images, PDFs, audio) to create enhanced, organized notes following Linking Your Thinking (LYT) methodology and Zettelkasten principles.

## Features

-   **🎯 Smart Note Enhancement**: Automatically enhance draft notes with AI-powered analysis and organization
-   **📎 Multi-Format Support**: Process images, PDFs, and audio files embedded in your notes
-   **🎨 Multiple Output Formats**: Choose from Enhanced, Structured, or Analytical output styles
-   **✍️ Customizable Prompts**: Tailor the AI's behavior to match your note-taking methodology
-   **🔗 LYT & Zettelkasten**: Built-in support for advanced note-taking methodologies
-   **📊 Concept Mapping**: Automatic generation of mermaid diagrams to visualize relationships
-   **🎵 Audio Transcription**: Process audio files and generate structured notes from transcriptions
-   **🔖 Smart Organization**: Automatic tag suggestions, hierarchical structure, and key takeaways

## Installation

### From Obsidian Community Plugins (Recommended)

_Coming soon - pending approval_

### Manual Installation

1. Download the latest release files (`main.js`, `manifest.json`, `styles.css`)
2. Create a folder in your vault: `.obsidian/plugins/obsidian-ai-note-enhancement/`
3. Copy the downloaded files into this folder
4. Reload Obsidian
5. Enable the plugin in Settings → Community plugins

## Setup

1. Get a Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Open Obsidian Settings → AI Note Enhancer
3. Enter your Gemini API key
4. Choose your preferred model (gemini-2.5-pro recommended)
5. Select your desired output format
6. Optionally customize the enhancement prompt

## Usage

### Basic Usage

1. Create or open a note with draft content
2. Optionally embed files (audio, images, PDFs) using `![[filename]]` syntax
3. Run the command: `Enhance Note with AI` (Ctrl/Cmd+P to open command palette)
4. Wait for the AI to process your content and attachments
5. Enhanced content will be appended to your note

### Output Formats

**Enhanced** (Default)

-   Clean, organized structure
-   Well-formatted markdown
-   First-person perspective

**Structured**

-   Executive summary at the top
-   Hierarchical sections with bullet points
-   Key takeaways section
-   Suggested tags

**Analytical**

-   Deep analysis with insights
-   Main themes and concepts
-   Critical thinking and connections
-   Questions for exploration
-   Mermaid concept maps

### Supported File Types

-   **Audio**: MP3, WAV, M4A, WebM
-   **Images**: PNG, JPG, JPEG
-   **Documents**: PDF

## Settings

### Basic Settings

-   **Gemini API Key**: Your Google Gemini API key
-   **Model Name**: Gemini model to use (gemini-2.5-pro, gemini-1.5-pro, etc.)
-   **Output Format**: Choose between Enhanced, Structured, or Analytical

### Advanced Settings

-   **Custom Enhancement Prompt**: Customize the AI's behavior and output style
-   **Include Original Content**: Toggle to append original draft at the end for reference

## Example Use Cases

### 📝 Meeting Notes with Audio

Record or import meeting audio, add a few bullet points, run enhancement to get:

-   Structured meeting notes with key decisions
-   Action items and assignments
-   Important details (names, dates, numbers)
-   Concept relationships

### 📚 Research Notes with PDFs

Embed research PDFs and images, add initial thoughts, enhance to get:

-   Comprehensive literature analysis
-   Key concepts and connections
-   Critical insights
-   Suggested links to related ideas

### 💡 Quick Ideas to Detailed Notes

Jot down rough ideas, enhance to get:

-   Organized, hierarchical structure
-   Expanded explanations
-   Related concepts
-   Tags for organization

## Privacy & Security

-   All processing happens via Google Gemini API
-   Your API key is stored locally in Obsidian
-   No data is stored or logged by this plugin
-   Files are temporarily uploaded to Google for processing
-   Review [Google's AI API Terms](https://ai.google.dev/terms) for details

## Troubleshooting

### API Key Issues

-   Ensure your API key is valid and has access to Gemini API
-   Check you haven't exceeded API quota limits

### File Upload Failures

-   Large files may take longer to process (be patient)
-   Some file formats might not be supported by the API
-   Check your internet connection

### Enhancement Not Working

-   Verify you have note content or embedded files
-   Check console (Ctrl/Cmd+Shift+I) for error messages
-   Try with a smaller note first

## Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/Alex-Shanyi-Yuan/obsidian-ai-note-enhancement.git
cd obsidian-ai-note-enhancement

# Install dependencies
npm install

# Development build (watch mode)
npm run dev

# Production build
npm run build
```

### Project Structure

```
├── main.ts                 # Plugin entry point
├── src/
│   ├── settings.ts        # Settings interface and defaults
│   ├── services/
│   │   └── gemini.ts      # Gemini API integration
│   └── utils/
│       └── file-processing.ts  # File handling utilities
├── manifest.json          # Plugin manifest
└── styles.css            # Plugin styles
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Credits

Inspired by:

-   [Smart Memos](https://github.com/Mossy1022/Smart-Memos) - For note generation concepts
-   Linking Your Thinking (LYT) methodology
-   Zettelkasten principles

## License

MIT License - See LICENSE file for details

## Support

-   🐛 [Report Issues](https://github.com/Alex-Shanyi-Yuan/obsidian-ai-note-enhancement/issues)
-   💡 [Feature Requests](https://github.com/Alex-Shanyi-Yuan/obsidian-ai-note-enhancement/issues)
-   📖 [Documentation](https://github.com/Alex-Shanyi-Yuan/obsidian-ai-note-enhancement)

---

Made with ❤️ for the Obsidian community
