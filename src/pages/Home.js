import React from 'react';

const Home = () => {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is the main landing page of your website.</p>
      {/* Add more content or components as needed */}

      <audio controls>
        <source src="https://github.com/austinaguirre/personalsite/blob/main/public/music/Derp-Song%20(2).wav" type="audio/wav" />
        Your browser does not support the audio element.
      </audio>

    </div>
  );
};

export default Home;

