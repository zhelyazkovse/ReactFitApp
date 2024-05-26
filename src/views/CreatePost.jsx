import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { addPost } from '../services/posts.service';
import { AppContext } from '../context/AppContext';
import './CreatePost.css';

export default function CreatePost() {
    const { userData } = useContext(AppContext);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            if (title.length >= 8 && title.length <= 64 && content.length >= 32 && content.length <= 8192) {
                const postId = await addPost(userData.handle, title, content);
                //checking what the postid is
                console.log("Newly created post ID:", postId);
                navigate(`/posts`);
            } else {
                alert("Ensure title and content lengths are within the required limits.");
            }
        } catch (error) {
            console.error('Failed to submit post:', error);
            alert("An error occurred while submitting the post. Please try again.");
        }
    };

    return (
        <div className="content-page">
            <h1>Create Post</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title:</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                />
                <label htmlFor="content">Content:</label>
                <textarea
                    id="content"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    required
                />
                <button type="submit">Create Post</button>
            </form>
        </div>
    );
}
