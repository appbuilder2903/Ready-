import React, { useEffect, useRef } from 'react';

interface LiveVisualizerProps {
  analyser: AnalyserNode | null;
}

const LiveVisualizer: React.FC<LiveVisualizerProps> = ({ analyser }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;

        const r = barHeight + 25 * (i / bufferLength);
        const g = 250 * (i / bufferLength);
        const b = 50;

        // Neon coloring
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.shadowBlur = 15;
        ctx.shadowColor = `rgb(${r},${g},${b})`;
        
        ctx.fillRect(x, canvas.height - barHeight * 1.5, barWidth, barHeight * 1.5);

        x += barWidth + 1;
      }
    };

    draw();
  }, [analyser]);

  return <canvas ref={canvasRef} className="w-full h-48 rounded border border-cyan-500/30" width={600} height={200} />;
};

export default LiveVisualizer;