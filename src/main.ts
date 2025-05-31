import ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';

// Function to display help
function showHelp(): void {
    console.log(`
Usage: ts-node video-cutter.ts <input_video> <start_time> <end_time> <output_file>

Arguments:
  input_video  : Path to the input video (e.g.: input.mp4)
  start_time   : Start time for the cut (accepted formats: hh:mm:ss, mm:ss, or number of seconds)
  end_time     : End time for the cut (accepted formats: hh:mm:ss, mm:ss, or number of seconds)
  output_file  : Output file path (e.g.: output.mkv)

Example:
  ts-node video-cutter.ts input.mp4 00:01:30 00:02:00 output.mkv
  ts-node video-cutter.ts input.mp4 90 120 output.mkv
`);
    process.exit(1);
}

// Function to convert time to seconds
function parseTime(time: string): number {
    // Format hh:mm:ss
    const hmsMatch = time.match(/^(\d+):(\d{2}):(\d{2})$/);
    if (hmsMatch) {
        const hours = parseInt(hmsMatch[1], 10);
        const minutes = parseInt(hmsMatch[2], 10);
        const seconds = parseInt(hmsMatch[3], 10);
        return hours * 3600 + minutes * 60 + seconds;
    }

    // Format mm:ss
    const msMatch = time.match(/^(\d+):(\d{2})$/);
    if (msMatch) {
        const minutes = parseInt(msMatch[1], 10);
        const seconds = parseInt(msMatch[2], 10);
        return minutes * 60 + seconds;
    }

    // Format number of seconds
    const secondsMatch = time.match(/^\d+$/);
    if (secondsMatch) {
        return parseInt(time, 10);
    }

    throw new Error(`Invalid time format: ${time}`);
}

// Function to display a progress bar
function displayProgress(progress: { percent: number }): void {
    const barLength = 50;
    const filled = Math.round(progress.percent / 100 * barLength);
    const empty = barLength - filled;
    const bar = '█'.repeat(filled) + ' '.repeat(empty);
    process.stdout.write(`\rProgress: [${bar}] ${Math.round(progress.percent)}%`);
}

// Main function
function main(): void {
    // Argument validation
    const args = process.argv.slice(2);
    if (args.length !== 4) {
        console.error('Error: Incorrect number of arguments.');
        showHelp();
    }

    const [inputFile, startTime, endTime, outputFile] = args;

    // Check if input file exists
    if (!fs.existsSync(inputFile)) {
        console.error(`Error: Input file "${inputFile}" does not exist.`);
        process.exit(1);
    }

    // Check output file extension
    if (!outputFile.endsWith('.mkv')) {
        console.error('Error: Output file must have .mkv extension');
        process.exit(1);
    }

    // Check output directory
    const outputDir = path.dirname(outputFile);
    if (outputDir && !fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Time conversion
    let startSeconds: number, endSeconds: number;
    try {
        startSeconds = parseTime(startTime);
        endSeconds = parseTime(endTime);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }

    // Validate time values
    if (startSeconds < 0 || endSeconds < startSeconds) {
        console.error('Error: Times must be positive and end time must be greater than start time.');
        process.exit(1);
    }

    // Calculate duration
    const duration = endSeconds - startSeconds;

    // FFmpeg command
    ffmpeg(inputFile)
        .setStartTime(startSeconds)
        .setDuration(duration)
        .outputOptions([
            '-c:v copy', // Copy video codec without re-encoding
            '-c:a copy', // Copy audio codec without re-encoding
            '-sn'        // Ignore subtitles
        ])
        .output(outputFile)
        .on('progress', displayProgress)
        .on('end', () => {
            console.log('\nProcessing completed! File saved as:', outputFile);
        })
        .on('error', (err) => {
            console.error('\nError during processing:', err.message);
            process.exit(1);
        })
        .run();
}

// Execute the script
main();