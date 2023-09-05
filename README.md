# promise-audioconcat [![NPM](https://img.shields.io/npm/v/promise-audioconcat.svg)](https://www.npmjs.com/package/promise-audioconcat) [![Licence](https://img.shields.io/npm/l/promise-audioconcat.svg)](https://github.com/move-zig/promise-audioconcat) [![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

Concatenates multiple audio files using [`ffmpeg`](http://ffmpeg.org).

`promise-audioconcat` provides a programmatic interface to do basically the same as calling `ffmpeg` via CLI like:

```bash
ffmpeg -i "concat:audio1.mp3|audio2.mp3" -acodec copy out.mp3
```

## Install

```bash
npm install promise-audioconcat
```

## Usage

### TypeScript

```ts
import audioconcat from 'promise-audioconcat';
```

### JavaScript

```js
const audioconcat = require('promise-audioconcat');
```

## API

### `audioconcat(inputs: string[], output: string): Promise<void>`

* **inputs:** an array of the filenames of the audio files to concatenate
* **output:** the filename of the output file

**Note:** The output file will be overwritten if it exists.

```js
const songs = [
  'introduction.mp3',
  'recording.mp3',
];

const output = 'combined.mp3';

try {
  await audioconcat(songs, output);
  console.log(`Audio created in ${output}`);
} catch (err) {
  console.error('Error:', err);
  console.error('ffmpeg stderr:', err.stderr);
}
```

## See also

* [audioconcat](https://www.npmjs.com/package/audioconcat) - The package that inspired this one
* [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg) - The underlying ffmpeg library
* [@ffmpeg-installer/ffmpeg](https://github.com/kribblo/node-ffmpeg-installer) - Provides the required ffmpeg binaries

