import React, { useState } from 'react';

const Post = ({ post, fetchPostComments }) => {
  const [comment, setComment] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);

  const handleAddComment = async () => {
    if (!comment.trim()) return; // Prevent empty comments

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/events/${post._id}/newComment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include any authentication headers if required
        },
        body: JSON.stringify({ text: comment }),
        credentials: 'include', // Include cookies for auth
      });

      if (response.ok) {
        setComment(''); // Reset comment input
        setIsAddingComment(false); // Hide input after submitting
        fetchPostComments(post._id); // Fetch updated comments for the post
      } else {
        console.error('Failed to add comment');
        // Handle error - e.g., show an error message
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  return (
    <div>
      <p>{post.title} by {post.createdBy.username} on {new Date(post.createdAt).toLocaleDateString()}</p>
      {/* Display comments */}
      {post.comments.map((c, index) => (
        <div key={index}>
          <p>{c.text} by {c.postedBy.username}</p>
        </div>
      ))}
      {isAddingComment ? (
        <>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
          <button onClick={handleAddComment}>Submit Comment</button>
        </>
      ) : (
        <button onClick={() => setIsAddingComment(true)}>Leave a Comment</button>
      )}
    </div>
  );
};

export default Post;
