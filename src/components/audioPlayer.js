//           <audio controls src={`${process.env.PUBLIC_URL}${file}`}>
import React from 'react';

const backendBaseUrl = process.env.REACT_APP_BACKEND_URL;

const AudioPlayer = ({ audioFilePath }) => {
  
  const fullAudioFilePath = `${backendBaseUrl}${audioFilePath}`;

  return (
    <div>
      <audio controls src={fullAudioFilePath}>
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;
