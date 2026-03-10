# NRC Studio — Blockbench Plugin

Blockbench plugin for creating emotes and cosmetics for NoRiskClient.

## Setup

```bash
cd plugins/nrc_studio
npm install
```

## Build

Single build:
```bash
npm run build
```

Watch mode (auto-rebuild on save):
```bash
npm run watch
```

Both produce `nrc_studio.js` in the plugin root.

## Loading in Blockbench

1. Open Blockbench
2. Go to **File > Plugins** (or press `Ctrl+Shift+P`)
3. Click the folder icon **Load Plugin from File**
4. Select `nrc_studio.js`

To reload after code changes (if not using Blockbench's dev reload):
- Disable the plugin, then re-enable it — or restart Blockbench

## Testing

1. **Create a project** — File > New > **NRC Studio Model** > select "Emote"
2. **Add bones/keyframes** — Switch to the Animate tab, create an animation, and add keyframes on bones (rotation, position, scale)
3. **Check bezier interpolation** — Set keyframe interpolation to "bezier" and verify handles appear in the timeline graph
4. **Export animation** — File > Export > **Export NRC Animation** — open the `.animation.json` and verify `lerp_mode`, `bezier_left_time/value`, `bezier_right_time/value` are present
5. **Export model** — File > Export > **Export NRC Model** — verify the `.geo.json` output

## Project Structure

```
src/
  index.js          Plugin entry point (onload/onunload lifecycle)
  constants.js      NRC_FORMAT_ID, NrcModelType
  format.js         Blockbench ModelFormat registration
  logger.js         Logging utilities (console + temp file)
  export/
    animation.js    Animation export with native bezier support
    model.js        Model export
  templates/
    emote.js        Default emote skeleton template
build.mjs           esbuild config (build + watch)
nrc_studio.js       Built output (loaded by Blockbench)
```
