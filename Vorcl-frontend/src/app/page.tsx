import Audio from './components/Audio';
import { NextUIProvider } from '@nextui-org/system';

export default function Home() {
  return (
    <NextUIProvider>
      <Audio />
    </NextUIProvider>
  );
}
