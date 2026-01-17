# How to Add Demo Video to GitHub README

Since GitHub doesn't directly support embedding MP4 videos in README.md, here are the best options:

## Option 1: GitHub Assets (Recommended for Small Videos)

### Step 1: Upload Video to GitHub

1. Go to your GitHub repository
2. Click on "Issues" tab
3. Click "New Issue"
4. In the comment box, **drag and drop** your `app-demo.mp4` file
5. Wait for it to upload (you'll see a progress bar)
6. GitHub will generate a URL like:
   ```
   https://github.com/user-attachments/assets/abc123def456.mp4
   ```
7. **Copy this URL** (don't submit the issue, just close it)

### Step 2: Update README

Replace the placeholder in README.md:

```markdown
https://github.com/user-attachments/assets/your-video-id-here
```

With your actual URL:

```markdown
https://github.com/user-attachments/assets/abc123def456.mp4
```

---

## Option 2: Convert to GIF (Best Compatibility)

### Using Online Tools

1. Go to https://ezgif.com/video-to-gif
2. Upload `app-demo.mp4`
3. Select key frames (first 30 seconds recommended)
4. Convert and download
5. Save as `docs/demo/app-demo.gif`

### Update README

```markdown
![AI Doctor Assistant Demo](docs/demo/app-demo.gif)
```

---

## Option 3: YouTube (Best for Long Videos)

### Upload to YouTube

1. Go to YouTube Studio
2. Upload `app-demo.mp4`
3. Set visibility to **Unlisted** (not public, but accessible via link)
4. Copy the video URL

### Update README

```markdown
[![AI Doctor Assistant Demo](https://img.youtube.com/vi/YOUR_VIDEO_ID/maxresdefault.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)

_Click to watch the full demo on YouTube_
```

---

## Option 4: GitHub Releases (For Large Files)

### Create a Release

1. Go to your repository
2. Click "Releases" → "Create a new release"
3. Tag version: `v1.0.0`
4. Attach `app-demo.mp4` as a binary file
5. Publish release

### Link in README

```markdown
[📹 Download Demo Video](https://github.com/username/repo/releases/download/v1.0.0/app-demo.mp4)
```

---

## Current Setup

Your video is currently at:

```
docs/demo/app-demo.mp4
```

**File Size Check**: Run this to see if it's under GitHub's 100MB limit:

```bash
# Windows PowerShell
(Get-Item "docs/demo/app-demo.mp4").Length / 1MB
```

If over 25MB, consider:

- Compressing with HandBrake
- Converting to GIF (first 30 seconds)
- Uploading to YouTube

---

## Recommended Approach

**For Portfolio/Interviews**: Use **Option 1** (GitHub Assets) or **Option 3** (YouTube)

- Most professional
- Easy to share
- No file size issues

**For Quick Demo**: Use **Option 2** (GIF)

- Plays inline in README
- No clicking required
- Best user experience

---

## Need Help?

If you need to compress the video:

### Using HandBrake (Free)

1. Download from https://handbrake.fr/
2. Open `app-demo.mp4`
3. Select "Fast 1080p30" preset
4. Click "Start Encode"
5. Output will be much smaller

### Using FFmpeg (Command Line)

```bash
ffmpeg -i app-demo.mp4 -vcodec h264 -acodec aac -b:v 1M app-demo-compressed.mp4
```

---

**Next Steps**: Choose your preferred option above and update the README.md accordingly!
