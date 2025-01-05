import fs from "node:fs/promises";
import { Readable, Writable } from "node:stream";
import ffmpeg from "fluent-ffmpeg";
import ffmpeg_inst from "@ffmpeg-installer/ffmpeg";
import ffprobe from "ffprobe-static";

ffmpeg.setFfmpegPath(ffmpeg_inst.path);
ffmpeg.setFfprobePath(ffprobe.path);

export async function extractAudioChannelData(buffer) {
  return new Promise((resolve) => {
    const readableStream = new Readable({
      read() {},
    });
    readableStream.push(buffer);
    readableStream.push(null);
    const outputChunks = [];

    setImmediate(() => {
      var ffcmd = ffmpeg(readableStream)
        .noVideo()
        .audioChannels(1)
        .audioCodec("pcm_s16le")
        .audioFrequency(24000)
        .format("s16le")

        .on("error", (err) => {
          console.error("Ошибка:", err);
        })
        .on("end", () => {
          const outputBuffer = Buffer.concat(outputChunks);
          console.log("Преобразование завершено");
          if (outputBuffer) {
            resolve(outputBuffer);
          }
        })
        .pipe()
        .on("data", function (chunk) {
          outputChunks.push(chunk);
          console.log("ffmpeg just wrote " + chunk.length + " bytes");
        });
    });
  });
}
