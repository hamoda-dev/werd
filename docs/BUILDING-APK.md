# Building the Android APK (local)

Steps to build an installable `.apk` on your own machine. No cloud account needed.

---

## Requirements (one-time setup)

- **Node.js** 20 or newer — check with `node -v`
- **JDK 17** on your `PATH` — check with `java -version` (must say `17.x`)
- **Android SDK** with `ANDROID_HOME` set. Easiest way: install **Android Studio**, open it once, and let it install the SDK. Then add to your shell profile (`~/.bashrc` or `~/.zshrc`):
  ```bash
  export ANDROID_HOME="$HOME/Android/Sdk"
  export PATH="$ANDROID_HOME/platform-tools:$PATH"
  ```
  From Android Studio → **SDK Manager**, make sure these are installed:
  - Android SDK Platform
  - Android SDK Build-Tools
  - Android SDK Platform-Tools (gives you `adb`)
  - NDK + CMake (downloads automatically on the first build, just slow)

---

## Build steps

### 1. Install dependencies (once, and after pulling new code)
```bash
npm install
```

### 2. Build the release APK (standalone — runs without a dev server)
```bash
cd android
./gradlew assembleRelease
```
The finished APK is at:
```
android/app/build/outputs/apk/release/app-release.apk
```

> First build downloads the NDK/CMake and can take several minutes. Later builds are much faster.

### 3. Install it on a phone

Either:
- Copy the `.apk` to the phone and tap it (enable **Install unknown apps** when prompted), **or**
- With the phone plugged in (USB debugging on):
  ```bash
  adb install -r android/app/build/outputs/apk/release/app-release.apk
  ```

---

## Other commands

```bash
# Clean build, if something is cached wrong
cd android && ./gradlew clean && ./gradlew assembleRelease

# Debug APK instead (needs the Metro dev server running to load JS)
cd android && ./gradlew assembleDebug
#   -> android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `SDK location not found` | Set `ANDROID_HOME`, or create `android/local.properties` with `sdk.dir=/path/to/Android/Sdk`. |
| `Unsupported class file major version` / Java errors | Make sure the active Java is **17**: `java -version`. |
| First build is very slow | Normal — it's downloading the NDK and compiling native code. It's cached after that. |
