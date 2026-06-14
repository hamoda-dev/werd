#!/usr/bin/env bash
#
# start-dev.sh — Start Metro and open the werd development build on an Android device.
#
# What it does:
#   1. Makes sure an Android device is connected (USB, or wireless via mDNS discovery).
#   2. Detects this computer's LAN IP (the address the phone loads the bundle from).
#   3. Starts the Metro dev server (reuses it if already running).
#   4. Cold-launches the installed dev build pointed at Metro, so the app opens
#      directly instead of sitting on the Expo dev-launcher screen.
#
# Prerequisites (one-time):
#   - The dev build is already installed on the device:  npx expo run:android
#   - adb + Node.js on PATH.
#   - For wireless: enable Developer options → Wireless debugging on the phone,
#     on the same Wi-Fi as this computer. First time only, pair once:
#       adb pair <ip>:<pairing-port>     # code shown under "Pair device with pairing code"
#
# Usage:
#   ./scripts/start-dev.sh                      # auto-discover device, start Metro, open app
#   ./scripts/start-dev.sh 192.168.100.157:34085  # connect to a specific adb host:port first
#
# Optional overrides (env vars):
#   WERD_PACKAGE  (default com.hamodadev.werd)
#   WERD_SCHEME   (default werd)
#   WERD_PORT     (default 8081)
#   WERD_LAN_IP   (default: auto-detected)

set -uo pipefail

# ---- Config -------------------------------------------------------------------
PACKAGE="${WERD_PACKAGE:-com.hamodadev.werd}"
SCHEME="${WERD_SCHEME:-werd}"
PORT="${WERD_PORT:-8081}"
DEVICE_ARG="${1:-${WERD_DEVICE:-}}"   # optional adb host:port to connect first

# ---- Pretty output ------------------------------------------------------------
log()  { printf '\033[36m▶ %s\033[0m\n' "$*"; }
ok()   { printf '\033[32m✓ %s\033[0m\n' "$*"; }
warn() { printf '\033[33m! %s\033[0m\n' "$*"; }
die()  { printf '\033[31m✗ %s\033[0m\n' "$*" >&2; exit 1; }

command -v adb >/dev/null || die "adb not found on PATH (install Android platform-tools)."
command -v npx >/dev/null || die "npx not found on PATH (install Node.js)."

# ---- Helpers ------------------------------------------------------------------
device_connected() { adb devices | grep -qE "[[:space:]]device$"; }
metro_up() { curl -s -m 3 "http://localhost:$PORT/status" 2>/dev/null | grep -q "packager-status:running"; }

# URL-encode http://ip:port  ->  http%3A%2F%2Fip%3Aport  (order: % then : then /)
enc_url() { local s="$1"; s="${s//%/%25}"; s="${s//:/%3A}"; s="${s//\//%2F}"; printf '%s' "$s"; }

# ---- 1. Connect a device ------------------------------------------------------
# adb connect can return before the device reaches the "device" state (especially
# right after the adb daemon starts), so we connect AND poll for a few seconds,
# re-discovering over mDNS each loop.
[ -n "$DEVICE_ARG" ] && { log "Connecting to $DEVICE_ARG ..."; adb connect "$DEVICE_ARG" >/dev/null 2>&1 || true; }

for attempt in $(seq 1 8); do
  device_connected && break
  if [ -z "$DEVICE_ARG" ]; then
    TARGET="$(adb mdns services 2>/dev/null | awk '/_adb-tls-connect/ {print $NF; exit}')"
    if [ -n "${TARGET:-}" ]; then
      [ "$attempt" -eq 1 ] && log "Discovered $TARGET — connecting ..."
      adb connect "$TARGET" >/dev/null 2>&1 || true
    fi
  else
    adb connect "$DEVICE_ARG" >/dev/null 2>&1 || true
  fi
  sleep 2
done

device_connected || die "No Android device connected.
  • USB:      plug in + accept the debugging prompt.
  • Wireless: enable Developer options → Wireless debugging, then
                adb connect <ip>:<port>        (IP:port shown on that screen)
              First time only, pair first:
                adb pair <ip>:<pairing-port>"

SERIAL="$(adb devices | awk '/[[:space:]]device$/ {print $1; exit}')"
ok "Device: $SERIAL"

adb -s "$SERIAL" shell pm path "$PACKAGE" >/dev/null 2>&1 \
  || die "App '$PACKAGE' is not installed. Build it once:  npx expo run:android"

# ---- 2. Detect this computer's LAN IP -----------------------------------------
LAN_IP="${WERD_LAN_IP:-$(hostname -I 2>/dev/null | tr ' ' '\n' \
  | grep -E '^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)' | head -1)}"
[ -n "$LAN_IP" ] || die "Could not detect a LAN IP. Set WERD_LAN_IP=<your-computer-ip>."
URL="http://$LAN_IP:$PORT"
ok "Metro URL for the phone: $URL"

# ---- 4 (deferred): once Metro is up, tunnel + launch the app ------------------
launch_app() {
  for _ in $(seq 1 40); do metro_up && break; sleep 2; done
  metro_up || { warn "Metro not ready — open the app from the dev launcher and enter $URL"; return; }
  adb -s "$SERIAL" reverse "tcp:$PORT" "tcp:$PORT" >/dev/null 2>&1 || true   # localhost backstop
  log "Opening $PACKAGE on the phone ..."
  adb -s "$SERIAL" shell am force-stop "$PACKAGE" >/dev/null 2>&1
  adb -s "$SERIAL" shell am start -a android.intent.action.VIEW \
    -d "$SCHEME://expo-development-client/?url=$(enc_url "$URL")" "$PACKAGE" >/dev/null 2>&1
  ok "App launched — it loads from Metro in a few seconds. Edit a .tsx and save to hot-reload."
}

# ---- 3. Start Metro -----------------------------------------------------------
if metro_up; then
  ok "Metro already running on :$PORT — just (re)opening the app."
  launch_app
  exit 0
fi

log "Starting Metro (npx expo start --dev-client) ..."
launch_app &                       # in the background: wait for Metro, then open the app
exec npx expo start --dev-client --port "$PORT"   # foreground: interactive Metro (press r, j, etc.)
