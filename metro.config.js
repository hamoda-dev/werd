// Metro configuration — extends the Expo defaults.
//
// Excludes native build output, tooling, and docs dirs from Metro's file
// watcher. These contain no JS that Metro needs to bundle, but on Linux they
// add thousands of inotify watches (android/.cxx alone is ~900 CMake dirs),
// which can trip "ENOSPC: System limit for number of file watchers reached".
// Dropping them also speeds up bundler startup. (.git is ignored by Metro by default.)
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const root = escapeRegExp(__dirname);
const dir = (name) => new RegExp(`^${root}/${name}/.*`);

// Append to Expo's defaults (must be flagless RegExps so Metro can combine them).
config.resolver.blockList = [
  ...config.resolver.blockList,
  dir("android"),
  dir("ios"),
  dir("\\.expo"),
  dir("\\.superpowers"),
  dir("design_handoff_werd_app"),
];

module.exports = config;
