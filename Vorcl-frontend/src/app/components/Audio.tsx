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
      console.log(event);
    };
    return () => {
      if (webSocket.readyState !== WebSocket.CLOSED) {
        webSocket.close();
      }
    };
  }, []);

  const handleClick = async () => {
    if (recording && mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
      setRecording(false);
      console.log('Microphone recording stopped');
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setMediaStream(stream);
        const options = {
          audioBitsPerSecond: 48000,
          mimeType: 'audio/webm; codecs=opus',
        };
        const recorder = new MediaRecorder(stream, options);
        setRecording(true);
        recorder.start();
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
    <div className="bg-audio-background rounded-[24px] m-auto flex flex-col pt-[20px] w-[552px] h-[313px]">
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
