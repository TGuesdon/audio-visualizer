import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import "./App.css";
import { AudioManager } from "./lib/AudioManager";
import { FFTRenderer } from "./lib/FFTRenderer";
import { ThreeRenderer } from "./lib/ThreeRenderer";
import { TimeRenderer } from "./lib/TimeRenderer";

export const SIZE = 64;

function App() {
  const [initialized, setInitialized] = useState(false);
  const [file, setFile] = useState<File | null>();
  const audioManager = useRef<AudioManager>();
  const container = useRef<HTMLDivElement>(null);
  const displayer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!file) return;
    if (audioManager.current) audioManager.current.playFile(file);

    const containerRef = container.current;
    const displayerRef = displayer.current;
    if (!containerRef || !displayerRef) return;

    const frequencyCanvas = document.createElement("canvas");
    const frequencyContext = frequencyCanvas.getContext("2d");

    const timeCanvas = document.createElement("canvas");
    const timeContext = timeCanvas.getContext("2d");

    if (!frequencyContext || !timeContext) throw new Error("Canvas context not supported");

    const frequencyRenderer = new FFTRenderer(frequencyContext);
    const timeRenderer = new TimeRenderer(timeContext);
    const threeRenderer = new ThreeRenderer(displayerRef);

    const render = () => {
      const freqData = audioManager.current?.getCurrentFrequencyData();
      const timeData = audioManager.current?.getCurrentTimeData();

      frequencyRenderer.render(freqData || new Uint8Array(SIZE));
      timeRenderer.render(timeData || new Uint8Array(SIZE));
      threeRenderer.updateData(freqData || new Uint8Array(SIZE));

      requestAnimationFrame(render);
    };

    const loop = requestAnimationFrame(render);

    frequencyCanvas.width = FFTRenderer.WIDTH;
    frequencyCanvas.height = FFTRenderer.HEIGHT;
    timeCanvas.width = TimeRenderer.WIDTH;
    timeCanvas.height = TimeRenderer.HEIGHT;

    containerRef.appendChild(frequencyCanvas);
    containerRef.appendChild(timeCanvas);

    return () => {
      cancelAnimationFrame(loop);
      containerRef.removeChild(frequencyCanvas);
      containerRef.removeChild(timeCanvas);
      threeRenderer.clean();
    };
  }, [file]);

  useEffect(() => {
    if (!initialized) return;
    audioManager.current = new AudioManager();

    return () => {
      audioManager.current?.clean();
    };
  }, [initialized]);

  return (
    <>
      {!initialized && <button onClick={() => setInitialized(true)}>Initialize</button>}
      {initialized && !file && (
        <div className="App">
          <input type="file" accept=".mp3" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
        </div>
      )}
      <Hud ref={container}></Hud>
      <Display ref={displayer}></Display>
    </>
  );
}

export default App;

const Hud = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  display: flex;
  flex-direction: column;

  opacity: 0.3;

  &:hover {
    opacity: 0.9;
  }

  transition: opacity 0.3s ease-in-out;
`;

const Display = styled.div`
  width: 100vw;
  height: 100vh;

  position: absolute;
  top: 0;
  left: 0;

  z-index: -1;
`;
