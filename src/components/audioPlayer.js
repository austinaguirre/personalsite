import React from 'react';
import audioFiles from './audioFiles.json';

const AudioPlayer = () => {
  return (
    <div>
      {audioFiles.map((file, index) => (
        <div key={index}>
          <audio controls src={`${process.env.PUBLIC_URL}${file}`}>
            Your browser does not support the audio element.
          </audio>
        </div>
      ))}
    </div>
  );
};

export default AudioPlayer;
