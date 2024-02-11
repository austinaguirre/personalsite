import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Post from '../components/Post';

const SinglePost = () => {
  const { postId } = useParams();
  const navigate = useNavigate(); // Use useNavigate for navigation
  const [post, setPost] = useState(null);

  const fetchPost = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/events/${postId}`, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setPost(data);
      } else {
        console.error('Failed to fetch post');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  }, [postId]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost, postId]);

  return (
    <div>
      <button onClick={() => navigate(-1)}>Back</button> {/* Use navigate(-1) for back functionality */}
      {post ? (
        <>
          <h2>{post.title}</h2>
          <p><strong>By:</strong> {post.createdBy.username}</p>
          <p><strong>Date:</strong> {new Date(post.createdAt).toLocaleDateString()}</p>
          <p><strong>Description:</strong> {post.description}</p>
          <p><strong>Tags:</strong> {post.tags.join(', ')}</p> {/* Display tags */}
          {/* Pass fetchPost as fetchPostComments for refreshing comments */}
          <Post post={post} fetchPostComments={fetchPost} />
        </>
      ) : <p>Loading post...</p>}
    </div>
  );
};

export default SinglePost;
