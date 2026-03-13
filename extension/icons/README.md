# Extension Icons

This directory contains SVG icon files that can be converted to PNG for use in the Chrome extension.

## Current Status

✅ SVG files are included:
- icon16.svg
- icon48.svg
- icon128.svg

⚠️ PNG files are optional for development but recommended for production.

## Converting SVG to PNG (Optional)

Chrome extensions work without icons during development, but for better appearance you can convert the SVG files to PNG.

### Using ImageMagick (Command Line)

If you have ImageMagick installed:

```bash
cd extension/icons
convert -background none icon16.svg icon16.png
convert -background none icon48.svg icon48.png
convert -background none icon128.svg icon128.png
```

### Using Online Tools

Upload the SVG files to any of these free converters:
- [CloudConvert](https://cloudconvert.com/svg-to-png)
- [Online-Convert](https://image.online-convert.com/convert-to-png)
- [Convertio](https://convertio.co/svg-png/)

### Using Inkscape (Free Desktop App)

1. Open the SVG file in Inkscape
2. File → Export PNG Image
3. Set the appropriate dimensions (16x16, 48x48, 128x128)
4. Export

## After Converting to PNG

If you create PNG files, update `manifest.json` to reference them:

```json
"action": {
  "default_popup": "popup.html",
  "default_icon": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
},
"icons": {
  "16": "icons/icon16.png",
  "48": "icons/icon48.png",
  "128": "icons/icon128.png"
}
```

## Creating Custom Icons

Feel free to replace the provided SVG files with your own designs. The icons should represent a calendar or meeting scheduling concept.

Recommended design tools:
- Figma (web-based, free)
- Inkscape (free, open-source)
- Adobe Illustrator
- Affinity Designer
