# Packaging Options for Card Tracker

This document describes the different ways to package the Card Tracker CLI tool into standalone executables and AppImages.

## **Option 1: pkg (Node.js Executables) - RECOMMENDED**

### **Build Commands:**

```bash
# Build for specific platforms
npm run build:linux    # Linux executable
npm run build:mac      # macOS executable  
npm run build:win      # Windows executable
npm run build:all      # All platforms

# Or build all at once
npm run build
```

### **Output Files:**
- `dist/card-tracker-linux` - Linux executable (~75MB)
- `dist/card-tracker-macos` - macOS executable (~80MB)
- `dist/card-tracker-windows.exe` - Windows executable (~67MB)

### **Features:**
- ✅ **Standalone executables** - No Node.js installation required
- ✅ **Cross-platform** - Works on Linux, macOS, Windows
- ✅ **Self-contained** - All dependencies included
- ✅ **Fast startup** - Optimized for CLI usage
- ✅ **Small size** - ~70-80MB per platform

### **Usage:**
```bash
# Linux
./dist/card-tracker-linux --help
./dist/card-tracker-linux list games

# macOS  
./dist/card-tracker-macos --help
./dist/card-tracker-macos list games

# Windows
card-tracker-windows.exe --help
card-tracker-windows.exe list games
```

---

## **Option 2: AppImage (Linux Only)**

### **Build Process:**
```bash
# 1. Build the Linux executable
npm run build:linux

# 2. Create AppDir structure
mkdir -p AppDir/usr/bin AppDir/usr/share/applications AppDir/usr/share/icons/hicolor/256x256/apps

# 3. Copy executable
cp dist/card-tracker-linux AppDir/usr/bin/card-tracker

# 4. Create AppRun script
# (See AppDir/AppRun for content)

# 5. Create desktop entry
# (See AppDir/usr/share/applications/card-tracker.desktop for content)

# 6. Create squashfs
mksquashfs AppDir card-tracker.squashfs -root-owned -noappend

# 7. Download runtime and create AppImage
wget -O runtime https://github.com/AppImage/AppImageKit/releases/download/continuous/runtime-x86_64
chmod +x runtime
cat runtime card-tracker.squashfs > CardTracker-x86_64.AppImage
chmod +x CardTracker-x86_64.AppImage
```

### **Output File:**
- `CardTracker-x86_64.AppImage` - Linux AppImage (~95MB)

### **Features:**
- ✅ **Portable** - Runs on any Linux distribution
- ✅ **No installation** - Just download and run
- ✅ **Desktop integration** - Shows in application menu
- ✅ **Self-contained** - All dependencies included
- ✅ **Sandboxed** - Runs in isolated environment

### **Usage:**
```bash
# Make executable and run
chmod +x CardTracker-x86_64.AppImage
./CardTracker-x86_64.AppImage --help
./CardTracker-x86_64.AppImage list games
```

---

## **Option 3: Docker Container**

### **Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY src/ ./src/
RUN npm install -g .

ENTRYPOINT ["card-tracker"]
```

### **Build and Run:**
```bash
# Build image
docker build -t card-tracker .

# Run container
docker run --rm -v $(pwd)/.db:/app/.db card-tracker --help
docker run --rm -v $(pwd)/.db:/app/.db card-tracker list games
```

---

## **Option 4: Snap Package**

### **snapcraft.yaml:**
```yaml
name: card-tracker
version: '1.0.0'
summary: Card Tracker CLI tool
description: A powerful CLI tool for fetching and managing card data from the CardTrader API

confinement: strict
grade: stable

apps:
  card-tracker:
    command: card-tracker
    plugs: [network]

parts:
  card-tracker:
    plugin: nodejs
    source: .
    nodejs-version: "18"
```

### **Build and Install:**
```bash
# Build snap
snapcraft

# Install locally
sudo snap install card-tracker_1.0.0_amd64.snap --dangerous
```

---

## **Option 5: Flatpak**

### **com.cardtracker.CardTracker.yml:**
```yaml
app-id: com.cardtracker.CardTracker
runtime: org.freedesktop.Platform
runtime-version: '23.08'
sdk: org.freedesktop.Sdk
command: card-tracker
finish-args:
  - --share=network
modules:
  - name: card-tracker
    buildsystem: simple
    build-commands:
      - npm ci --only=production
      - npm install -g .
    sources:
      - type: dir
        path: .
```

### **Build and Install:**
```bash
# Build flatpak
flatpak-builder build com.cardtracker.CardTracker.yml

# Install
flatpak-builder --user --install --force-clean build com.cardtracker.CardTracker.yml
```

---

## **Comparison Table**

| Method | Size | Dependencies | Installation | Cross-Platform | Ease of Use |
|--------|------|--------------|--------------|----------------|-------------|
| **pkg** | ~75MB | None | Copy executable | ✅ Linux/macOS/Windows | ⭐⭐⭐⭐⭐ |
| **AppImage** | ~95MB | None | Download & run | ❌ Linux only | ⭐⭐⭐⭐ |
| **Docker** | ~200MB | Docker runtime | `docker run` | ✅ All platforms | ⭐⭐⭐ |
| **Snap** | ~100MB | Snapd | `snap install` | ❌ Linux only | ⭐⭐⭐ |
| **Flatpak** | ~150MB | Flatpak runtime | `flatpak install` | ❌ Linux only | ⭐⭐ |

---

## **Recommendations**

### **For End Users:**
1. **pkg executables** - Best for most users (simple, portable, cross-platform)
2. **AppImage** - Best for Linux users who prefer AppImages

### **For Developers:**
1. **pkg** - Fastest development cycle
2. **Docker** - Best for CI/CD and containerized environments

### **For Distribution:**
1. **pkg** - GitHub Releases with multiple platform executables
2. **AppImage** - Linux distribution repositories

---

## **Build Scripts**

### **Quick Build (All Platforms):**
```bash
npm run build
```

### **Linux AppImage Build:**
```bash
npm run build:linux
# Then follow AppImage creation steps above
```

### **Clean Build:**
```bash
rm -rf dist/ AppDir/ *.squashfs *.AppImage runtime
npm run build
```

---

## **Troubleshooting**

### **pkg Issues:**
- **Module not found**: Add to `pkg.assets` in `package.json`
- **File system errors**: Check `process.pkg` detection in code
- **Large file size**: Use `.pkgignore` to exclude unnecessary files

### **AppImage Issues:**
- **Permission denied**: `chmod +x CardTracker-x86_64.AppImage`
- **Runtime not found**: Download runtime manually
- **Desktop integration**: Check `.desktop` file syntax

### **Common Solutions:**
```bash
# Rebuild with clean cache
rm -rf node_modules/ package-lock.json
npm install
npm run build

# Test executable
./dist/card-tracker-linux --help

# Test AppImage
./CardTracker-x86_64.AppImage --help
``` 