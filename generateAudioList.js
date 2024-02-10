const fs = require('fs');
const path = require('path');

// Assuming your project's structure follows the standard create-react-app layout
const musicDirPath = path.join(__dirname, 'public', 'music');
const outputPath = path.join(__dirname, 'src', 'audioFiles.json');

// Read the music directory
fs.readdir(musicDirPath, (err, files) => {
  if (err) {
    console.error('Error reading music directory:', err);
    return;
  }

  // Filter out non-MP3 files if necessary
  const mp3Files = files.filter(file => file.endsWith('.mp3'));

  // Convert file names to paths
  const filePaths = mp3Files.map(file => `/music/${file}`);

  // Write the array to a JSON file in the src directory
  fs.writeFile(outputPath, JSON.stringify(filePaths), err => {
    if (err) {
      console.error('Error writing audioFiles.json:', err);
    } else {
      console.log('audioFiles.json has been generated successfully.');
    }
  });
});
