import React from 'react';
import { useAuth } from '../context/AuthContext'; // Adjust the import path as necessary

const Home = () => {
  const { currentUser } = useAuth(); // Use the useAuth hook to access currentUser

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is the main landing page of your website.</p>
      
      {/* Display different images based on login status */}
      {currentUser ? (
        // Show this image if the user is logged in
        <img src={`${process.env.PUBLIC_URL}/images/download2.jpeg`} alt="Exclusive Image" />
      ) : (
        // Show this image if the user is not logged in
        <img src={`${process.env.PUBLIC_URL}/images/download.jpeg`} alt="Welcome Image" />
      )}
    </div>
  );
};

export default Home;
