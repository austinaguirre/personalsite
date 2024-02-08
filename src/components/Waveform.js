import React, { useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';

const Waveform = ({ audioFile }) => {
  const waveformRef = useRef(null);

  useEffect(() => {
    // Create WaveSurfer instance
    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: 'violet',
      progressColor: 'purple',
      cursorColor: 'navy',
    });

    // Load audio file
    wavesurfer.load(audioFile);

    return () => {
      // Clean up WaveSurfer instance
      wavesurfer.destroy();
    };
  }, [audioFile]);

  return (
    <div>
      <div ref={waveformRef} />
    </div>
  );
};

export default Waveform;
