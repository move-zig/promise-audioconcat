import fs from 'fs';
import path from 'path';
import { beforeEach, describe, expect, it } from '@jest/globals';

import audioconcat, { AudioConcatError } from '..';

describe('audioconcat', () => {
  const input1 = path.resolve(__dirname, 'sample-15s.mp3');
  const input2 = path.resolve(__dirname, 'file_example_MP3_5MG.mp3');
  const invalidFile = path.resolve(__dirname, 'something_else.mp3');
  const output = path.resolve(__dirname, 'output.mp3');
  const other1 = path.resolve(__dirname, 'other1.mp3');
  const other2 = path.resolve(__dirname, 'other2.mp3');
  const other3 = path.resolve(__dirname, 'other3.mp3');

  beforeEach(async () => {
    for (const file of [ output, other1, other2, other3 ]) {
      if (fs.existsSync(file)) {
        await fs.promises.unlink(file);
      }
    }
  });

  it('should combine files', async () => {
    await expect(audioconcat([ input1, input2 ], output)).resolves.toBeUndefined();
    expect(fs.existsSync(output)).toBe(true);

    const input1Stats1 = await fs.promises.stat(input1);
    const input1Stats2 = await fs.promises.stat(input2);
    const outputStats = await fs.promises.stat(output);

    expect(outputStats.size).toBeGreaterThan(input1Stats1.size + input1Stats2.size);
  });

  it('should reject if an input isn\'t found', async () => {
    await expect(audioconcat([ input1, invalidFile ], output)).rejects.toBeInstanceOf(AudioConcatError);
    expect(fs.existsSync(output)).toBe(false);
  });

  it('should reject if an invalid output is specified', async () => {
    await expect(audioconcat([ input1, input2 ], 'z')).rejects.toThrow();
    expect(fs.existsSync(output)).toBe(false);
  });

  it('should work when called multiple times at once', async () => {
    await expect(Promise.all([
      audioconcat([ input1, input2 ], output),
      audioconcat([ input1, input2, input2, input2 ], other1),
      audioconcat([ input1, input2, input2, input2, input2, input1, input1, input2 ], other2),
      audioconcat([ input1, input2, input1, input2, input1, input2 ], other3),
    ])).resolves.toBeTruthy();

    expect(fs.existsSync(output)).toBe(true);
    expect(fs.existsSync(other1)).toBe(true);
    expect(fs.existsSync(other2)).toBe(true);
    expect(fs.existsSync(other3)).toBe(true);
  });
});
