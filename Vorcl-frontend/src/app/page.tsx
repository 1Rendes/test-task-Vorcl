'use client';
// import { useLottie } from 'lottie-react';
import blueMicro from '../../assets/blue-micro.json';
import redMicro from '../../assets/red-micro.json';
import { Player } from '@lottiefiles/react-lottie-player';

import { useState } from 'react';

export default function Home() {
  const [recording, setRecording] = useState(false);
  // const { View, play, stop } = useLottie({
  //   animationData: animationMicro,
  //   loop: true,
  //   autoplay: false,
  //   style: { width: 170, height: 170 },
  // });
  const handleClick = () => {
    if (!recording) {
      setRecording(true);
    } else {
      setRecording(false);
    }
  };
  return (
    <div className="bg-audio-background rounded-[24px] m-auto flex flex-col gap-[20px] w-[552px] h-[313px]">
      <h3 className="text-center mt-[77px] text-white text-xs">
        Start a conversation with assistants
      </h3>
      <button
        onClick={handleClick}
        className={`flex justify-center align-middle `}
      >
        <Player
          autoplay={recording}
          loop
          src={recording ? redMicro : blueMicro}
          style={{ height: '170px', width: '170px' }}
        />
      </button>
    </div>
  );
}
