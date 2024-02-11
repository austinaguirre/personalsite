import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Make sure the path is correct

const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [tags, setTagOptions] = useState([]);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const { checkAuthentication } = useAuth(); // Use checkAuthentication to refresh user state if needed

  useEffect(() => {
    // Fetch tags dynamically
    fetch(`${process.env.PUBLIC_URL}/tags.json`)
      .then(response => response.json())
      .then(data => setTagOptions(data))
      .catch(error => console.error('Error fetching tags:', error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    tags.forEach(tag => formData.append('tags', tag));
    formData.append('description', description);
    formData.append('audioFile', file);

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/events/newEvent`, {
      method: 'POST',
      body: formData,
      credentials: 'include', // Include cookies in the request
    });

    if (!response.ok && response.status === 401) {
      // If unauthorized, perhaps the session has expired; trigger a re-check of authentication status
      await checkAuthentication();
      console.error('Session expired. Please login again.');
      return;
    }

    if (response.ok) {
      const result = await response.json();
      console.log('Successfully created post:', result);
      // Handle success, such as redirecting to the posts page or showing a success message
    } else {
      throw new Error(`Error: ${response.statusText}`);
    }
  };

  const handleTagChange = (e) => {
    // Update the tags state based on selected options
    const selectedTags = Array.from(e.target.selectedOptions).map(option => option.value);
    setTagOptions(selectedTags);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
      <select multiple value={tags} onChange={handleTagChange}>
        {tags.map(tag => (
          <option key={tag} value={tag}>{tag}</option>
        ))}
      </select>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} accept=".mp3,.wav" required />
      <button type="submit">Submit Post</button>
    </form>
  );
};

export default CreatePostPage;
