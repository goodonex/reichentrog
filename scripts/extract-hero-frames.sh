#!/usr/bin/env bash
# FFmpeg: Video → WebP-Frames für Hero-Sequenz (Ausgabe z. B. public/hero-frames/ — in .gitignore)
set -euo pipefail
echo "Beispiel: ffmpeg -i input.mp4 -vf fps=30 public/hero-frames/frame_%04d.webp"
echo "Frames manuell auf <150KB/Frame optimieren."
