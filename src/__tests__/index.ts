import fs from 'fs';
import path from 'path';
import { beforeEach, describe, expect, it } from '@jest/globals';

import audioconcat, { AudioConcatError } from '..';

describe('audioconcat', () => {
  const input1 = path.resolve(__dirname, 'sample-15s.mp3');
  const input2 = path.resolve(__dirname, 'file_example_MP3_5MG.mp3');
  const invalidFile = path.resolve(__dirname, 'something_else.mp3');
  const output = path.resolve(__dirname, 'output.mp3');

  beforeEach(async () => {
    if (fs.existsSync(output)) {
      await fs.promises.unlink(output);
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
});
