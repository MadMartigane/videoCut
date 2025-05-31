# VideoCut

A fast and efficient video cutting tool built with TypeScript and FFmpeg. Cut your videos precisely without re-encoding to prepare your footage for video editing.

## Features

- ⚡ **Fast Processing**: Uses stream copying to avoid re-encoding, making cuts nearly instantaneous
- 🎯 **Precise Timing**: Supports multiple time formats (HH:MM:SS, MM:SS, or seconds)
- 📊 **Progress Tracking**: Real-time progress bar during processing
- 🎥 **Quality Preservation**: Maintains original video and audio quality
- 📁 **Smart Output**: Automatically creates output directories if they don't exist
- 🔧 **Simple CLI**: Easy-to-use command-line interface

## Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [FFmpeg](https://ffmpeg.org/) installed and available in your system PATH
- [pnpm](https://pnpm.io/) package manager

### Installing FFmpeg

#### Windows
Download from [FFmpeg official website](https://ffmpeg.org/download.html) or use Chocolatey:
```bash
choco install ffmpeg
```

#### macOS
```bash
brew install ffmpeg
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install ffmpeg
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd videoCut
```

2. Install dependencies:
```bash
pnpm install
```

3. Build the project:
```bash
pnpm run build
```

## Usage

### Basic Syntax
```bash
pnpm start <input_video> <start_time> <end_time> <output_file>
```

### Time Formats
The tool accepts three different time formats:

- **HH:MM:SS** - Hours:Minutes:Seconds (e.g., `01:30:45`)
- **MM:SS** - Minutes:Seconds (e.g., `05:30`)
- **Seconds** - Total seconds as a number (e.g., `150`)

### Examples

Cut a video from 1 minute 30 seconds to 2 minutes:
```bash
pnpm start input.mp4 00:01:30 00:02:00 output.mkv
```

Cut using seconds format:
```bash
pnpm start input.mp4 90 120 output.mkv
```

Cut a longer segment:
```bash
pnpm start movie.mp4 00:05:00 00:08:30 highlight.mkv
```

### Output Format
- All output files must have the `.mkv` extension
- The tool preserves original video and audio codecs
- Subtitles are automatically excluded from the output

## Development

### Available Scripts

- `pnpm run build` - Compile TypeScript to JavaScript
- `pnpm run watch` - Watch for changes and rebuild automatically
- `pnpm run dev` - Run in development mode
- `pnpm start` - Run the application
- `pnpm test` - Run tests (not implemented yet)

### Project Structure
```
videoCut/
├── src/
│   └── main.ts          # Main application logic
├── dist/                # Compiled JavaScript output
├── package.json         # Project configuration
├── tsconfig.json        # TypeScript configuration
├── LICENSE              # MIT License
└── README.md           # This file
```

## How It Works

VideoCut uses FFmpeg's stream copying feature (`-c:v copy -c:a copy`) to extract video segments without re-encoding. This approach:

- Preserves original quality
- Processes files much faster than re-encoding
- Maintains original codecs and container format
- Results in smaller processing overhead

## Error Handling

The tool includes comprehensive error handling for:

- Invalid time formats
- Non-existent input files
- Invalid time ranges (negative times, end time before start time)
- Missing output directories (automatically created)
- FFmpeg processing errors

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg)
- Powered by [FFmpeg](https://ffmpeg.org/)
- Written in [TypeScript](https://www.typescriptlang.org/)