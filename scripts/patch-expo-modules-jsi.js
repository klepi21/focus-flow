/**
 * Patches expo-modules-jsi Swift files for Xcode 26 / Swift 6 compatibility.
 * Swift 6 requires `weak` references to be `var` (not `let`) and
 * `nonisolated(unsafe)` when on a `Sendable`-conforming class.
 * Remove this script once Expo releases a fix for Xcode 26.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const baseDir = path.join(__dirname, '..', 'node_modules', 'expo-modules-jsi', 'apple', 'Sources', 'ExpoModulesJSI');

if (!fs.existsSync(baseDir)) {
  console.log('expo-modules-jsi not found, skipping patch.');
  process.exit(0);
}

function getAllSwiftFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getAllSwiftFiles(fullPath));
    } else if (file.endsWith('.swift')) {
      results.push(fullPath);
    }
  });
  return results;
}

const swiftFiles = getAllSwiftFiles(baseDir);
let patchedCount = 0;

swiftFiles.forEach((file) => {
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;

  // Step 1: weak let → weak var
  if (content.includes('weak let')) {
    content = content.replace(/weak let/g, 'weak var');
    modified = true;
  }

  // Step 2: weak var → nonisolated(unsafe) weak var (for Sendable classes)
  const patterns = [
    { from: /^(\s+)weak var runtime/gm, to: '$1nonisolated(unsafe) weak var runtime' },
    /^(\s+)private weak var runtime/gm,
    /^(\s+)internal weak var runtime/gm,
  ];

  const replacements = [
    [/^(\s+)weak var runtime/gm, '$1nonisolated(unsafe) weak var runtime'],
    [/^(\s+)private weak var runtime/gm, '$1nonisolated(unsafe) private weak var runtime'],
    [/^(\s+)internal weak var runtime/gm, '$1nonisolated(unsafe) internal weak var runtime'],
  ];

  replacements.forEach(([pattern, replacement]) => {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      modified = true;
    }
  });

  // Avoid double-patching
  content = content.replace(/nonisolated\(unsafe\) nonisolated\(unsafe\)/g, 'nonisolated(unsafe)');

  if (modified) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`✓ Patched: ${path.relative(process.cwd(), file)}`);
    patchedCount++;
  }
});

console.log(`expo-modules-jsi patch complete — ${patchedCount} file(s) updated.`);
