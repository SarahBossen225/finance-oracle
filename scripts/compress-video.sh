#!/bin/bash

# Finance Oracle Video Compression Script
# This script compresses the demo video for GitHub upload

set -e

INPUT_FILE="finance-oracle.mov"
OUTPUT_FILE="finance-oracle-demo.mp4"
QUALITY=28

echo "🎬 Finance Oracle Video Compression Script"
echo "=========================================="

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
    echo "❌ Error: $INPUT_FILE not found!"
    echo "Please make sure the video file is in the project root directory."
    exit 1
fi

# Get original file size
ORIGINAL_SIZE=$(ls -lh "$INPUT_FILE" | awk '{print $5}')
echo "📁 Original file: $INPUT_FILE ($ORIGINAL_SIZE)"

# Check if ffmpeg is available
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ ffmpeg not found!"
    echo ""
    echo "Please install ffmpeg first:"
    echo "  macOS: brew install ffmpeg"
    echo "  Ubuntu: sudo apt-get install ffmpeg"
    echo "  Windows: Download from https://ffmpeg.org/download.html"
    echo ""
    echo "Alternative: Use online tools like CloudConvert or HandBrake"
    echo "See VIDEO_COMPRESSION.md for detailed instructions."
    exit 1
fi

echo "🔧 Compressing video..."
echo "   Input: $INPUT_FILE"
echo "   Output: $OUTPUT_FILE"
echo "   Quality: $QUALITY (lower = better quality)"
echo ""

# Compress video
ffmpeg -i "$INPUT_FILE" \
    -vcodec libx264 \
    -crf $QUALITY \
    -preset fast \
    -vf "scale=1280:720" \
    -acodec aac \
    -b:a 128k \
    -y \
    "$OUTPUT_FILE"

# Check if compression was successful
if [ -f "$OUTPUT_FILE" ]; then
    COMPRESSED_SIZE=$(ls -lh "$OUTPUT_FILE" | awk '{print $5}')
    echo ""
    echo "✅ Compression completed successfully!"
    echo "📁 Compressed file: $OUTPUT_FILE ($COMPRESSED_SIZE)"
    
    # Check file size
    FILE_SIZE_MB=$(ls -l "$OUTPUT_FILE" | awk '{print int($5/1024/1024)}')
    if [ $FILE_SIZE_MB -lt 100 ]; then
        echo "✅ File is under 100MB and ready for GitHub upload!"
    else
        echo "⚠️  File is still over 100MB. Consider using a higher quality value (e.g., 32)."
    fi
    
    echo ""
    echo "📝 Next steps:"
    echo "1. Review the compressed video"
    echo "2. Commit and push to GitHub:"
    echo "   git add $OUTPUT_FILE"
    echo "   git commit -m 'Add compressed demo video'"
    echo "   git push"
else
    echo "❌ Compression failed!"
    exit 1
fi
