'use client';
import { Visualizer } from 'react-sound-visualizer';
import blueMicro from '../../../assets/blue-micro.json';
import redMicro from '../../../assets/red-micro.json';
import { Player } from '@lottiefiles/react-lottie-player';

import { useEffect, useState } from 'react';

const Audio = () => {
  const [recording, setRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [answer, setAnswer] = useState('');
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  useEffect(() => {
    const webSocketUrl = 'ws:localhost:3001/ws';
    const webSocket = new WebSocket(webSocketUrl);
    setSocket(webSocket);

    webSocket.onopen = () => {
      console.log('WebSocket is opened.');
    };
    webSocket.onerror = (error) => {
      console.log(error);
    };
    webSocket.onclose = () => {
      console.log('WebSocket is closed.');
    };
    webSocket.onmessage = (event) => {
      if (event.data === 'response.done') setAnswer('');
      else {
        const text = JSON.parse(event.data);
        setAnswer((prevText) => prevText + text);
      }
    };
    return () => {
      if (webSocket.readyState === WebSocket.OPEN) {
        webSocket.close();
      }
    };
  }, []);

  const handleClick = async () => {
    if (recording && mediaStream && audioContext && intervalId && analyser) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
      setRecording(false);
      audioContext.close();
      analyser.disconnect();
      clearInterval(intervalId);

      console.log('Microphone recording stopped');
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setMediaStream(stream);
        setRecording(true);
        const recorder = new MediaRecorder(stream);
        const audioContext = new AudioContext();
        setAudioContext(audioContext);
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        setAnalyser(analyser);

        analyser.fftSize = 256;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        source.connect(analyser);
        const silenceDurationThreshold = 1000;
        const intervalOfAnimationRequests = 200;
        let timeOfSilenceStart = 0;

        function checkForSilence() {
          analyser.getByteTimeDomainData(dataArray);
          const levelOfSilence = 5;
          const rms = Math.sqrt(
            dataArray.reduce(
              (sum, value) => sum + Math.pow(value - 128, 2),
              0,
            ) / dataArray.length,
          );

          if (rms < levelOfSilence) {
            if (timeOfSilenceStart === 0) {
              timeOfSilenceStart = Date.now();
            } else if (
              Date.now() - timeOfSilenceStart >=
              silenceDurationThreshold
            ) {
              recorder.stop();
              timeOfSilenceStart = 0;
            }
          } else {
            timeOfSilenceStart = 0;
            if (recorder.state === 'inactive') {
              recorder.start();
            }
          }
        }
        const intervalId = setInterval(() => {
          requestAnimationFrame(checkForSilence);
        }, intervalOfAnimationRequests);
        setIntervalId(intervalId);

        recorder.ondataavailable = async (event) => {
          if (socket) {
            console.log(await event.data.arrayBuffer());
            socket.send(await event.data.arrayBuffer());
          }
        };
      } catch (error) {
        console.error('No permission to microphone, ', error);
        setRecording(false);
      }
    }
  };

  return (
    <div className="bg-audio-background rounded-[24px] m-auto mt-[130px] mb-6 flex flex-col pt-[20px] w-[552px] h-auto">
      <div className=" flex justify-center items-center text-white text-xs h-[100]">
        {mediaStream ? (
          <Visualizer
            audio={mediaStream}
            autoStart={recording}
            slices={4}
            strokeColor={'#9013FE'}
            rectWidth={30}
            barRadius={15}
          >
            {({ canvasRef }) => (
              <canvas ref={canvasRef} width={200} height={100} />
            )}
          </Visualizer>
        ) : (
          'Start a conversation with assistants'
        )}
      </div>
      <div className="mx-4 border-gray-100 border-solid text-white rounded-md">
        {answer}
      </div>
      <button
        onClick={handleClick}
        className={`flex justify-center align-middle `}
      >
        <Player
          autoplay={recording}
          loop
          src={recording ? redMicro : blueMicro}
          style={{ height: '180px', width: '180px' }}
        />
      </button>
    </div>
  );
};

export default Audio;
