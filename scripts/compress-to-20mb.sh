#!/bin/bash

# Finance Oracle Video Compression Script - Target: 20MB
# This script compresses the demo video to under 20MB for GitHub upload

set -e

INPUT_FILE="finance-oracle.mov"
OUTPUT_FILE="finance-oracle-demo-20mb.mp4"
TARGET_SIZE_MB=20

echo "🎬 Finance Oracle Video Compression Script (20MB Target)"
echo "======================================================"

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
    echo "❌ Error: $INPUT_FILE not found!"
    echo "Please make sure the video file is in the project root directory."
    exit 1
fi

# Get original file size
ORIGINAL_SIZE=$(ls -lh "$INPUT_FILE" | awk '{print $5}')
ORIGINAL_SIZE_MB=$(ls -l "$INPUT_FILE" | awk '{print int($5/1024/1024)}')
echo "📁 Original file: $INPUT_FILE ($ORIGINAL_SIZE)"

# Check if ffmpeg is available
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ ffmpeg not found!"
    echo ""
    echo "Please install ffmpeg first:"
    echo "  macOS: brew install ffmpeg"
    echo "  Ubuntu: sudo apt-get install ffmpeg"
    echo "  Windows: Download from https://ffmpeg.org/download.html"
    exit 1
fi

echo "🎯 Target size: ${TARGET_SIZE_MB}MB"
echo "🔧 Using aggressive compression settings..."

# Calculate target bitrate (rough estimate)
# Target bitrate = (Target size in MB * 8 * 1024) / Duration in seconds
# We'll use a conservative approach with multiple quality levels

echo ""
echo "🔄 Attempting compression with multiple quality levels..."

# Try different quality settings
for QUALITY in 35 40 45 50; do
    echo ""
    echo "📹 Trying quality level: $QUALITY"
    
    # Compress video with aggressive settings
    ffmpeg -i "$INPUT_FILE" \
        -vcodec libx264 \
        -crf $QUALITY \
        -preset slow \
        -vf "scale=854:480" \
        -acodec aac \
        -b:a 64k \
        -ar 22050 \
        -y \
        "$OUTPUT_FILE" 2>/dev/null
    
    # Check file size
    if [ -f "$OUTPUT_FILE" ]; then
        COMPRESSED_SIZE_MB=$(ls -l "$OUTPUT_FILE" | awk '{print int($5/1024/1024)}')
        COMPRESSED_SIZE=$(ls -lh "$OUTPUT_FILE" | awk '{print $5}')
        
        echo "   📊 Result: $COMPRESSED_SIZE ($COMPRESSED_SIZE_MB MB)"
        
        if [ $COMPRESSED_SIZE_MB -le $TARGET_SIZE_MB ]; then
            echo "   ✅ Success! File is under ${TARGET_SIZE_MB}MB"
            break
        else
            echo "   ⚠️  Still too large, trying higher quality..."
        fi
    fi
done

# Final check
if [ -f "$OUTPUT_FILE" ]; then
    FINAL_SIZE_MB=$(ls -l "$OUTPUT_FILE" | awk '{print int($5/1024/1024)}')
    FINAL_SIZE=$(ls -lh "$OUTPUT_FILE" | awk '{print $5}')
    
    echo ""
    echo "🎉 Compression completed!"
    echo "📁 Final file: $OUTPUT_FILE ($FINAL_SIZE)"
    
    if [ $FINAL_SIZE_MB -le $TARGET_SIZE_MB ]; then
        echo "✅ SUCCESS: File is under ${TARGET_SIZE_MB}MB and ready for GitHub!"
        
        # Calculate compression ratio
        COMPRESSION_RATIO=$((100 - (FINAL_SIZE_MB * 100 / ORIGINAL_SIZE_MB)))
        echo "📊 Compression ratio: ${COMPRESSION_RATIO}%"
        
        echo ""
        echo "📝 Next steps:"
        echo "1. Review the compressed video: open $OUTPUT_FILE"
        echo "2. Commit and push to GitHub:"
        echo "   git add $OUTPUT_FILE"
        echo "   git commit -m 'Add compressed demo video (${FINAL_SIZE_MB}MB)'"
        echo "   git push"
        
    else
        echo "⚠️  File is still ${FINAL_SIZE_MB}MB (target: ${TARGET_SIZE_MB}MB)"
        echo "💡 Consider:"
        echo "   - Reducing video duration"
        echo "   - Using lower resolution (e.g., 640x360)"
        echo "   - Using even higher quality values (50+)"
    fi
else
    echo "❌ Compression failed!"
    exit 1
fi

echo ""
echo "🔧 Compression settings used:"
echo "   - Resolution: 854x480 (480p)"
echo "   - Video codec: H.264"
echo "   - Audio: AAC 64kbps"
echo "   - Sample rate: 22050 Hz"
echo "   - Preset: slow (better compression)"
