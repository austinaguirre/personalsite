import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Post from '../components/Post';

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState({ title: '', author: '', tags: '', date: '' });
  const [tags, setTags] = useState([]); // Example tags
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [totalPosts, setTotalPosts] = useState(0); // Total posts for pagination
  const postsPerPage = 10; // Adjust as per your limit in the backend
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch tags dynamically
    fetch(`${process.env.PUBLIC_URL}/tags.json`)
      .then(response => response.json())
      .then(data => setTags(data))
      .catch(error => console.error('Error fetching tags:', error));

    // Existing useEffect for fetching posts remains unchanged
  }, []); // Add this useEffect block to fetch tags

  useEffect(() => {
    const fetchPosts = async () => {
      const queryString = `${Object.entries(filter).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')}&page=${currentPage}&limit=${postsPerPage}`;

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/events?${queryString}`, { credentials: 'include' });
        if (response.ok) {
          const { data, count } = await response.json();
          setPosts(data);
          setTotalPosts(count);
        } else {
          console.error('Failed to fetch posts');
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [filter, currentPage]); // Re-fetch when filters or page changes

  // Add this function to fetch updated comments for a post
  const fetchPostComments = async (postId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/events/${postId}`, { credentials: 'include' });
      if (response.ok) {
        const updatedPost = await response.json();
        // Update the specific post in your state with the new comments
        setPosts(posts.map(post => post._id === postId ? updatedPost : post));
      } else {
        console.error('Failed to fetch updated post');
      }
    } catch (error) {
      console.error('Error fetching updated post:', error);
    }
  };

  // Handlers for pagination
  const nextPage = () => setCurrentPage(prev => prev + 1);
  const prevPage = () => setCurrentPage(prev => prev > 1 ? prev - 1 : 1);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h1>Posts</h1>
      {/* Filter Bar */}
      <div>
        <input type="text" name="title" placeholder="Filter by title" onChange={handleFilterChange} />
        <input type="text" name="author" placeholder="Filter by author" onChange={handleFilterChange} />
        <select name="tags" onChange={handleFilterChange}>
          <option value="">Select Tag</option>
          {tags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
        </select>
        <input type="date" name="date" placeholder="Filter by date" onChange={handleFilterChange} />
      </div>

      {/* Posts List */}
      {posts.map(post => (
        <Post key={post._id} post={post} fetchPostComments={fetchPostComments} />
      ))}
      {/* Pagination Controls */}
      <div>
        <button onClick={prevPage} disabled={currentPage === 1}>Prev</button>
        <span>Page {currentPage} of {Math.ceil(totalPosts / postsPerPage)}</span>
        <button onClick={nextPage} disabled={currentPage >= Math.ceil(totalPosts / postsPerPage)}>Next</button>
      </div>

      <button onClick={() => navigate('/create-post')}>Create New Post</button>
    </div>
  );
};

export default PostsPage;
