import fs from "node:fs/promises";
import { Readable, Writable } from "node:stream";
import ffmpeg from "fluent-ffmpeg";
import ffmpeg_inst from "@ffmpeg-installer/ffmpeg";
import ffprobe from "ffprobe-static";

ffmpeg.setFfmpegPath(ffmpeg_inst.path);
ffmpeg.setFfprobePath(ffprobe.path);

export function extractAudioChannelData(buffer) {
  console.log(buffer);

  // Создаем поток для входных данных
  const readableStream = new Readable({
    read() {},
  });
  readableStream.push(buffer);
  readableStream.push(null);

  // Создаем массив для выходных данных
  const outputChunks = [];
  const writable = new Writable({
    write(chunk, encoding, callback) {
      outputChunks.push(chunk); // Добавляем данные в массив
      //console.log("Step");
    },
  });

  fs.writeFile("input_web.mp3", buffer);
  const input = fs.readFile("voice.m4a");
  // Настраиваем ffmpeg
  ffmpeg("byaka.wav")
    .inputFormat("wav")
    //.fromFormat("webm") // Задаем формат входных данных
    // .noVideo()
    // .toFormat("")
    .audioChannels(1) // Одноканальный
    // .audioCodec("pcm_s16le")
    .audioFrequency(44100) // Частота дискретизации
    //.format("s16le") // Формат выходных данных
    .outputFormat("s16le")
    .on("error", (err) => {
      console.error("Ошибка:", err);
    })
    .on("end", () => {
      // Объединяем выходные данные в один буфер
      const outputBuffer = Buffer.concat(outputChunks);
      fs.writeFile("output.mp3", outputBuffer);
      console.log("Преобразование завершено");
      console.log(outputBuffer);

      //   const signed = new Int16Array(outputBuffer);
      //   console.log(signed.toString());
    })
    .pipe(writable); // Передаем данные в Writable
}
