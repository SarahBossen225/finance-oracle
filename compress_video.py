#!/usr/bin/env python3
"""
Simple video compression script using system tools
"""

import subprocess
import os
import sys

def compress_video(input_file, output_file, quality=35, target_size_mb=20):
    """
    Compress video using ffmpeg if available, otherwise provide instructions
    """
    try:
        # Check if ffmpeg is available
        subprocess.run(['ffmpeg', '-version'], capture_output=True, check=True)
        
        # Compress video with aggressive settings for 20MB target
        cmd = [
            'ffmpeg',
            '-i', input_file,
            '-vcodec', 'libx264',
            '-crf', str(quality),
            '-preset', 'slow',  # Better compression
            '-vf', 'scale=854:480',  # Lower resolution
            '-acodec', 'aac',
            '-b:a', '64k',  # Lower audio bitrate
            '-ar', '22050',  # Lower sample rate
            '-y',  # Overwrite output file
            output_file
        ]
        
        print(f"Compressing {input_file} to {output_file}...")
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Video compression completed successfully!")
            return True
        else:
            print(f"❌ Compression failed: {result.stderr}")
            return False
            
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ ffmpeg not found. Please install ffmpeg first:")
        print("   brew install ffmpeg")
        print("   or")
        print("   apt-get install ffmpeg")
        return False

def get_file_size(filepath):
    """Get file size in MB"""
    size_bytes = os.path.getsize(filepath)
    size_mb = size_bytes / (1024 * 1024)
    return size_mb

def main():
    input_file = "finance-oracle.mov"
    output_file = "finance-oracle-demo.mp4"
    
    if not os.path.exists(input_file):
        print(f"❌ Input file {input_file} not found!")
        return
    
    # Get original file size
    original_size = get_file_size(input_file)
    print(f"📁 Original file size: {original_size:.1f} MB")
    
    # Try to compress
    if compress_video(input_file, output_file):
        # Get compressed file size
        if os.path.exists(output_file):
            compressed_size = get_file_size(output_file)
            compression_ratio = (1 - compressed_size/original_size) * 100
            print(f"📁 Compressed file size: {compressed_size:.1f} MB")
            print(f"📊 Compression ratio: {compression_ratio:.1f}%")
            
            if compressed_size < 100:
                print("✅ File is now under 100MB and can be uploaded to GitHub!")
            else:
                print("⚠️  File is still over 100MB. Consider further compression.")
        else:
            print("❌ Output file was not created.")
    else:
        print("\n📝 Manual compression instructions:")
        print("1. Install ffmpeg: brew install ffmpeg")
        print("2. Run: ffmpeg -i finance-oracle.mov -vcodec libx264 -crf 28 -preset fast -vf 'scale=1280:720' -acodec aac -b:a 128k finance-oracle-demo.mp4")
        print("3. Or use online tools like CloudConvert or HandBrake")

if __name__ == "__main__":
    main()
