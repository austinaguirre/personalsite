import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Make sure the path is correct
import { useNavigate } from 'react-router-dom';

const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [selectedTags, setSelectedTags] = useState([]); // State for selected tags
  const [tagOptions, setTagOptions] = useState([]); // State for all tag options
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const { checkAuthentication } = useAuth(); // Use checkAuthentication to refresh user state if needed
  const navigate = useNavigate();
  const { fetchWithAuth } = useAuth();

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
    selectedTags.forEach(tag => formData.append('tags', tag));
    formData.append('description', description);
    formData.append('audioFile', file);

    try {
      const response = await fetchWithAuth(`${process.env.REACT_APP_API_URL}/api/events/newEvent`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Successfully created post:', result);
        navigate('/posts'); // Navigate to posts page or show success message
      } else {
        console.log("in error")
        throw new Error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleTagChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedTags(selected); // Update the state with the selected tags
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
      <select multiple value={selectedTags} onChange={handleTagChange}>
        {tagOptions.map(tag => (
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
