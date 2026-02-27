'use client';

import { useState } from 'react';
import { Comment } from '@/types';
import { useBoardStore } from '@/libs/store/useBoardStore';

interface CommentSectionProps {
  listId: string;
  cardId: string;
  comments: Comment[];
}

export const CommentSection = ({ listId, cardId, comments }: CommentSectionProps) => {
  const [commentText, setCommentText] = useState('');
  const addComment = useBoardStore((state) => state.addComment);

  const handleAddComment = () => {
    if (commentText.trim()) {
      addComment(listId, cardId, commentText.trim());
      setCommentText('');
    }
  };

  return (
    <div className="comments-section">
      <h3>Comments</h3>

      <div className="add-comment-box">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          rows={2}
        />
        <button
          onClick={handleAddComment}
          disabled={!commentText.trim()}
          className="btn-save-comment"
        >
          Add Comment
        </button>
      </div>

      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        ) : (
          [...comments].reverse().map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">User</span>
                <span className="comment-date">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="comment-text">{comment.text}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
