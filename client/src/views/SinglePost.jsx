import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, likePost, dislikePost, addCommentToPost, deletePost, updateComment } from '../services/posts.service';
import { AppContext } from '../context/AppContext';
import './SinglePost.css';

export default function SinglePost() {
    const { id } = useParams();
    const { userData } = useContext(AppContext);
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState('');
    const [isEditingComment, setIsEditingComment] = useState(null);
    const [editedCommentContent, setEditedCommentContent] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await getPostById(id);
                setPost({ ...data, comments: data.comments || [] });
            } catch (error) {
                console.error("Failed to fetch the post:", error.message);
            }
        };
        fetchPost();
    }, [id]);

    const handleLike = useCallback(async () => {
        if (userData && post && !post.likedBy.includes(userData.handle)) {
            await likePost(id, userData.handle);
            setPost(prev => ({
                ...prev,
                likedBy: [...prev.likedBy, userData.handle]
            }));
        }
    }, [id, userData, post]);

    const handleDislike = useCallback(async () => {
        if (userData && post && post.likedBy.includes(userData.handle)) {
            await dislikePost(id, userData.handle);
            setPost(prev => ({
                ...prev,
                likedBy: prev.likedBy.filter(handle => handle !== userData.handle)
            }));
        }
    }, [id, userData, post]);

    const submitComment = useCallback(async () => {
        if (comment.trim() && userData) {
            const commentId = await addCommentToPost(id, userData.handle, comment);
            setComment('');
            setPost(prev => ({
                ...prev,
                comments: [...prev.comments, { author: userData.handle, text: comment, id: commentId, createdOn: Date.now() }]
            }));
        }
    }, [id, userData, comment]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            await deletePost(post.id);
            navigate('/posts');
        }
    };

    const handleUpdateComment = async (commentId) => {
        if (editedCommentContent.trim()) {
            await updateComment(post.id, commentId, editedCommentContent);
            setPost(prev => ({
                ...prev,
                comments: prev.comments.map(c => c.id === commentId ? { ...c, text: editedCommentContent } : c)
            }));
            setIsEditingComment(null);
        }
    };

    if (!post) return <div>Loading...</div>;

    return (
        <div className="single-post-container">
            <h1 className="single-post-title">{post.title}</h1>
            <p className="single-post-content">{post.content}</p>
            <p className="single-post-author-date">by {post.author}, {new Date(post.createdOn).toLocaleDateString()}</p>

            <div className="single-post-actions">
                {post.likedBy.includes(userData?.handle) ? (
                    <button onClick={handleDislike}>Dislike</button>
                ) : (
                    <button onClick={handleLike}>Like</button>
                )}
                {(post.author === userData?.handle || userData?.isAdmin) && (
                    <button onClick={handleDelete}>Delete Post</button>
                )}
            </div>

            <div className="comment-section">
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="comment-input"
                />
                <button onClick={submitComment} className="submit-comment">Submit Comment</button>
            </div>

            <div className="comments">
                {post.comments.map((cmt) => (
                    <div key={cmt.id} className="comment">
                        {isEditingComment === cmt.id ? (
                            <div>
                                <textarea
                                    value={editedCommentContent}
                                    onChange={(e) => setEditedCommentContent(e.target.value)}
                                    className="edit-textarea"
                                />
                                <button onClick={() => handleUpdateComment(cmt.id)} className="submit-edit">Save</button>
                            </div>
                        ) : (
                            <p>{cmt.author}: {cmt.text}</p>
                        )}
                        {cmt.author === userData?.handle && isEditingComment !== cmt.id && (
                            <button onClick={() => {
                                setIsEditingComment(cmt.id);
                                setEditedCommentContent(cmt.text);
                            }}>Edit</button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
