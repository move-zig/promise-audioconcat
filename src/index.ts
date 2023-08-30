import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export class AudioConcatError extends Error {
  public constructor(err: Error, public stdout: string, public stderr: string) {
    super(err.message);
    this.name = this.constructor.name;
    this.stack = err.stack; // pass though original stack trace
  }
}

export default async (inputs: string[], output: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const filter = 'concat:' + inputs.join('|');

    const command = ffmpeg()
      .input(filter)
      .outputOptions('-acodec copy')
      .output(output);

    command.on('end', () => {
      resolve();
    });

    command.on('error', (err: Error, stdout: string, stderr: string) => {
      reject(new AudioConcatError(err, stdout, stderr));
    });

    command.run();
  });
};
