# SilentCut - Product Requirements Document (PRD)

**Product Name:** SilentCut  
**Version:** 1.0 MVP  
**Date:** December 20, 2025  
**Platform:** Next.js Web Application (Client-Side Only)  
**Theme:** Black and White Minimalist  

---

## 1. PRODUCT OVERVIEW

### Vision
SilentCut is a lightweight, privacy-first audio editing tool that detects silent pauses/gaps in audio files, displays them visually, allows users to review and select which pauses to remove, and downloads the edited audio in multiple formats.

### Core Value Proposition
- ⚡ **Instant Detection**: Identify pauses in seconds
- 👁️ **Visual Review**: See every pause with a waveform preview
- 🎯 **User Control**: Choose exactly which pauses to keep/remove
- 📥 **Multi-Format Download**: MP3, WAV, M4A, OGG
- 🔒 **100% Client-Side**: No server uploads, complete privacy
- 💰 **Completely Free**: No login, no ads, no limits

### Target Users
- Podcasters editing episodes
- YouTubers removing dead air
- Students trimming lecture recordings
- Audiobook narrators cleaning recordings
- Content creators optimizing audio

---

## 2. FEATURES & FUNCTIONALITY

### 2.1 Core Features (MVP)

#### Feature 1: Audio Upload
**User Story:** As a creator, I want to upload my audio file quickly and securely.

**Requirements:**
- Drag-and-drop upload zone (prominent, entire page)
- Click-to-browse file dialog
- Supported formats: MP3, WAV, M4A, OGG, WEBM
- File size limit: 100MB (client-side validation)
- Visual feedback during file reading
- Error handling for unsupported formats

**Technical Requirements:**
- Use Web Audio API to load files
- Show file name and duration after upload
- Display loading spinner during processing
- Use `FileReader` for client-side processing

---

#### Feature 2: Silence Detection & Analysis
**User Story:** As a creator, I want the app to automatically detect all silent pauses in my audio.

**Requirements:**
- Detect pauses based on configurable threshold:
  - Default silence threshold: -40dB
  - Default minimum pause duration: 0.5 seconds
  - Allow user to adjust both (advanced settings)
- Analyze entire audio file in real-time
- Display progress bar during analysis
- Return array of detected pause segments with:
  - Start time (in seconds)
  - End time (in seconds)
  - Duration (in seconds)
  - Average decibel level

**Technical Requirements:**
- Use Web Audio API's `AnalyserNode`
- Process audio in chunks (FFT analysis)
- Calculate RMS (Root Mean Square) for amplitude
- Show analysis progress (0-100%)
- Cache results for fast re-analysis if threshold changes

---

#### Feature 3: Waveform Visualization
**User Story:** As a creator, I want to see my audio visually with pauses highlighted.

**Requirements:**
- Display full waveform of audio file
- Highlight detected pauses in different color (red or light red)
- Show timeline with seconds/minutes markers
- Zoom controls (fit-to-width, zoom in/out)
- Pause segments clearly marked and labeled with duration
- Playable audio with seekbar synced to waveform
- Display current playback position

**Visual Design:**
- Background: Black (#000000 or #0A0A0A)
- Waveform line: White (#FFFFFF)
- Pauses highlight: Light Red (#FF6B6B or #E63946)
- Text: White on black (#FFFFFF)
- Accents: Teal or primary color for interactive elements

**Technical Requirements:**
- Use Canvas API to draw waveform
- Responsive to window resize
- Smooth scrolling/zoom
- Real-time playback position indicator

---

#### Feature 4: Pause Review & Selection
**User Story:** As a creator, I want to choose which pauses to remove and which to keep.

**Requirements:**
- List all detected pauses in a sidebar/panel
- For each pause, show:
  - Timestamp (start - end)
  - Duration (in seconds)
  - Toggle button (Keep / Remove)
  - Preview button (play just that segment)
- Bulk actions:
  - "Remove All Pauses"
  - "Keep All Pauses"
  - "Remove pauses longer than X seconds"
- Selected pauses highlighted on waveform
- Visual indicator showing how much audio will be removed

**Technical Requirements:**
- State management for pause selection (React hooks)
- Instant visual feedback when toggling pauses
- Calculate total time saved

---

#### Feature 5: Audio Preview & Playback
**User Story:** As a creator, I want to preview my audio and listen to specific pauses before removing them.

**Requirements:**
- Full audio playback with play/pause controls
- Seekbar synchronized with waveform
- Volume control (0-100%)
- Speed control (0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x)
- Mute button
- Current time / Total duration display
- "Preview segment" button for each pause (plays 1 second before + pause + 1 second after)

**Technical Requirements:**
- Use HTML5 `<audio>` element or Web Audio API
- Smooth scrubbing on seekbar
- Accurate time display

---

#### Feature 6: Download Edited Audio
**User Story:** As a creator, I want to download my edited audio in my preferred format.

**Requirements:**
- After removing selected pauses:
  - Re-encode audio (concatenate remaining segments)
  - Remove gaps between segments seamlessly
- Multiple download format options:
  - MP3 (default)
  - WAV
  - M4A
  - OGG
- Bitrate selection:
  - 128 kbps (low, smaller file)
  - 192 kbps (medium, balanced)
  - 256 kbps (high, best quality)
  - 320 kbps (lossless quality)
- Filename suggestion: `{original_name}_edited_{timestamp}.mp3`
- Download button prominent
- Progress indicator during encoding

**Technical Requirements:**
- Use `ffmpeg.js` (JavaScript FFmpeg) or `ffmpeg.wasm`
- Process entirely client-side
- Show encoding progress (0-100%)
- Automatically trigger browser download

---

### 2.2 Advanced Features (Future Versions)

- Batch processing (multiple files)
- Noise reduction
- Filler word detection (um, uh, like, you know)
- Background noise removal
- Auto-chaptering based on silence patterns
- Audio normalization
- Fade in/out effects
- Compare before/after waveforms

---

## 3. USER INTERFACE & UX

### 3.1 Layout Structure

```
┌─────────────────────────────────────────────┐
│  SilentCut  (Logo/Brand)                    │
│  Remove dead air from your audio instantly  │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │   Drag & Drop Upload Area           │   │
│  │   (or click to browse)              │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  [Play] [Pause] [Volume] [Speed]    │   │
│  │                                     │   │
│  │  ┌─────────────────────────────┐    │   │
│  │  │    Waveform Display         │    │   │
│  │  │  (Black bg, white waveform) │    │   │
│  │  │  (Red highlights = pauses)  │    │   │
│  │  └─────────────────────────────┘    │   │
│  │  00:00 ─────●──────────── 02:45      │   │
│  └─────────────────────────────────────┘   │
│                                             │
├─────────┬───────────────────────────────────┤
│ Pauses  │  Detected Pauses:               │
│ Panel   │  ☑ 00:12 - 00:17 (5s)          │
│ (Left)  │  ☑ 00:34 - 00:37 (3s)          │
│         │  ☐ 01:02 - 01:08 (6s)          │
│         │  ☑ 01:45 - 01:48 (3s)          │
│         │                                 │
│         │  Total Save: 17 seconds         │
│         │  [Remove All] [Keep All]        │
│         │  [Advanced Settings] ⚙️         │
│         │                                 │
│         │  ┌─────────────────────────┐    │
│         │  │ [Download as MP3] 🔘   │    │
│         │  │ [More Formats ▼]       │    │
│         │  └─────────────────────────┘    │
└─────────┴───────────────────────────────────┘
```

### 3.2 Color Scheme

**Primary Colors:**
- Background: Pure Black `#000000` or Dark Gray `#0A0A0A`
- Text: Pure White `#FFFFFF`
- Waveform: White `#FFFFFF`
- Pauses/Highlights: Red `#FF6B6B` or `#E63946`

**Accent Colors:**
- Primary Button: Teal `#06B6D4` or Cyan `#00D9FF`
- Secondary Button: Gray `#404040`
- Success: Green `#10B981`
- Error: Red `#EF4444`
- Hover States: Slightly lighter versions

**Text Hierarchy:**
- H1 (Brand): 32px, Bold, White
- H2 (Section): 20px, SemiBold, White
- Body: 14px, Regular, White
- Caption: 12px, Regular, Gray (#A0A0A0)

### 3.3 Typography

- Font Family: `Inter` or `Geist` (system fonts for performance)
- Font Stack: 
  ```
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
  ```

### 3.4 Responsive Design

- Mobile-first approach
- Breakpoints:
  - Mobile: 375px - 768px (Stack layout vertically)
  - Tablet: 768px - 1024px (Side panels reduce width)
  - Desktop: 1024px+ (Full layout)
- On mobile: Waveform full width, pause list scrollable below

---

## 4. TECHNICAL SPECIFICATIONS

### 4.1 Tech Stack

**Frontend:**
- Framework: Next.js 14+ (App Router)
- Language: TypeScript
- Styling: Tailwind CSS (for black/white theme)
- Audio Processing: Web Audio API, ffmpeg.wasm
- Visualization: Canvas API
- State Management: React Hooks (useState, useEffect, useContext)

**No Backend Required** (100% client-side)

### 4.2 Key Dependencies

```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.3.0",
  "@ffmpeg/ffmpeg": "^0.12.0",
  "@ffmpeg/util": "^0.12.0"
}
```

### 4.3 Core Algorithms

#### Silence Detection Algorithm
```
1. Load audio file into AudioContext
2. Create AnalyserNode with FFT size 2048
3. Iterate through audio buffer in chunks (512 samples)
4. Calculate RMS (Root Mean Square) for each chunk
5. Convert RMS to dB: 20 * log10(RMS)
6. Compare dB value against threshold (-40dB default)
7. Track consecutive frames below threshold
8. When duration > minDuration (0.5s), mark as pause
9. Return array: [{start, end, duration}, ...]
```

#### Audio Re-encoding Algorithm
```
1. User selects which pauses to remove
2. Create list of "keep segments" (inverse of remove list)
3. For each keep segment:
   - Extract audio buffer from original
   - Add to new offline audio context
4. Render offline context to WAV
5. Use ffmpeg.wasm to convert WAV → desired format
6. Trigger browser download
```

### 4.4 File Structure

```
src/
├── app/
│   ├── page.tsx (Main component)
│   ├── layout.tsx
│   └── globals.css (Tailwind imports)
├── components/
│   ├── UploadZone.tsx
│   ├── WaveformDisplay.tsx
│   ├── PauseList.tsx
│   ├── PlaybackControls.tsx
│   ├── DownloadPanel.tsx
│   └── SettingsModal.tsx
├── hooks/
│   ├── useAudioProcessing.ts
│   ├── useSilenceDetection.ts
│   └── useWaveform.ts
├── lib/
│   ├── audioUtils.ts (Audio processing logic)
│   ├── silenceDetector.ts (Detection algorithm)
│   ├── ffmpegHelper.ts (FFmpeg wrapper)
│   └── constants.ts (Thresholds, formats, etc.)
└── types/
    └── audio.ts (TypeScript interfaces)
```

---

## 5. USER FLOWS

### Flow 1: Upload & Detect
```
User lands on SilentCut
     ↓
User uploads audio file (drag-drop or click)
     ↓
App loads file into Web Audio API
     ↓
Silence detection runs (progress bar shown)
     ↓
Waveform displays with pauses highlighted
     ↓
Pause list populates on left panel
```

### Flow 2: Review & Preview
```
User sees detected pauses in list
     ↓
User plays full audio with seekbar
     ↓
User clicks "Preview" on specific pause
     ↓
App plays 1s before + pause + 1s after
     ↓
User decides to Keep or Remove pause
     ↓
Waveform updates, total save time recalculates
```

### Flow 3: Download
```
User reviews all pauses (toggles as needed)
     ↓
User clicks "Download as MP3" button
     ↓
App encodes audio (removes selected pauses)
     ↓
FFmpeg converts to selected format
     ↓
Browser downloads: silentcut_edited_timestamp.mp3
```

---

## 6. SETTINGS & CONFIGURATION

### 6.1 User-Adjustable Settings

**Silence Detection Settings:**
- Threshold (dB): -50 to -20 (slider, default -40)
- Minimum Duration (ms): 200 to 5000 (slider, default 500)

**Download Settings:**
- Format: MP3 / WAV / M4A / OGG (dropdown, default MP3)
- Bitrate: 128 / 192 / 256 / 320 kbps (dropdown, default 192)

**Playback Settings:**
- Volume: 0-100%
- Playback Speed: 0.5x to 2x

### 6.2 Advanced Features (Settings Modal)
- [ ] Compare before/after waveforms side-by-side
- [ ] Export pause report (JSON with timestamps)
- [ ] Theme toggle (Light/Dark - future)
- [ ] Keyboard shortcuts help

---

## 7. ERROR HANDLING

### Error Cases

| Error | Message | Solution |
|-------|---------|----------|
| Unsupported format | "Format not supported. Try MP3, WAV, M4A, or OGG" | Show supported formats |
| File too large | "File exceeds 100MB limit" | Show max size |
| Corrupted audio | "Unable to decode audio file" | Prompt re-upload |
| Browser incompatible | "Web Audio API not supported in your browser" | Show compatibility notice |
| Encoding failed | "Download encoding failed. Try different format" | Retry option |
| Memory error | "File too large for processing. Reduce file size" | Suggest splitting |

---

## 8. PERFORMANCE REQUIREMENTS

- Audio file processing: < 5 seconds for 60-minute file
- Waveform rendering: Smooth 60 FPS
- FFmpeg encoding: Background worker (non-blocking UI)
- Total app load: < 2 seconds (including ffmpeg.js download)
- Download trigger: Instant after encoding completes

---

## 9. ACCESSIBILITY REQUIREMENTS

- WCAG 2.1 Level AA compliance
- Keyboard navigation (Tab, Enter, Space)
- Focus indicators visible on all buttons
- Semantic HTML (`<button>`, `<input>`, `<label>`)
- Alt text on all icons/images
- Color contrast: 4.5:1 for text
- Screen reader compatible

---

## 10. DEPLOYMENT & HOSTING

**Recommended Platform:** Vercel (native Next.js support)
- Zero-config deployment
- Edge function support (optional)
- Environmental variables for analytics (optional)

**Domain:** silentcut.app or silentcut.io
**SSL:** Auto-enabled on Vercel

---

## 11. ANALYTICS & TRACKING (OPTIONAL)

**Optional metrics to track (no personal data):**
- Total files processed (day/week/month)
- Average file size
- Popular formats downloaded
- Most common threshold adjustments
- Browser/device stats
- Tool: Vercel Analytics or Plausible (privacy-friendly)

---

## 12. SUCCESS METRICS

**MVP Success Criteria:**
- ✅ App loads in < 2 seconds
- ✅ Silence detection accurate within ±0.1 seconds
- ✅ Waveform renders smoothly (60 FPS)
- ✅ Download works for all 4 formats
- ✅ Zero bugs on Chrome, Firefox, Safari (recent versions)
- ✅ Mobile responsive and usable
- ✅ 100% client-side (no data leaves device)

**Launch Success:**
- 100+ daily active users in first week
- Average session time: 3-5 minutes
- Conversion to download: >30%
- Zero critical bugs in first month

---

## 13. ROADMAP

### Phase 1 (MVP - Launch)
- [x] Audio upload
- [x] Silence detection
- [x] Waveform visualization
- [x] Pause review & toggle
- [x] Audio download (MP3, WAV)

### Phase 2 (Month 1-2)
- [ ] Add M4A & OGG formats
- [ ] Advanced settings panel (threshold, duration adjustment)
- [ ] Batch processing (multiple files)
- [ ] Keyboard shortcuts
- [ ] Dark/Light theme toggle

### Phase 3 (Month 2-3)
- [ ] Filler word detection (um, uh, like)
- [ ] Background noise detection
- [ ] Waveform zoom/pan
- [ ] Pause export report (JSON)
- [ ] Share edited audio (optional cloud)

### Phase 4 (Future)
- [ ] Background music preservation
- [ ] Speaker detection & separation
- [ ] Auto-captions
- [ ] Podcast metadata editing
- [ ] Integration with podcast hosting platforms

---

## 14. LAUNCH CHECKLIST

**Before Launch:**
- [ ] All features tested (Chrome, Firefox, Safari, mobile)
- [ ] Error handling for all edge cases
- [ ] Performance optimized (< 2s load)
- [ ] Accessibility audit passed
- [ ] Landing page & docs written
- [ ] FFmpeg binary optimized for size
- [ ] Favicon & metadata configured
- [ ] og:image for social sharing
- [ ] Privacy policy (no data collection) written
- [ ] Deployment to Vercel

**Post-Launch:**
- [ ] Post on ProductHunt
- [ ] Share on Twitter/X, Reddit, Indie Hackers
- [ ] Email contacts (podcast platforms, creators)
- [ ] Monitor error logs
- [ ] Collect user feedback

---