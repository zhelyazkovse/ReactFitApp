import React, { useEffect, useState, useContext } from 'react';
import { getAllPosts } from '../services/posts.service';
import Post from '../components/Post/Post.jsx';
import { AppContext } from '../context/AppContext';
import './MyPosts.css';

export default function MyPosts() {
    const { userData } = useContext(AppContext);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (!userData) return;

        const fetchMyPosts = async () => {
            const allPosts = await getAllPosts('');
            const myPosts = allPosts.filter(post => post.author === userData.handle);
            setPosts(myPosts);
        };

        fetchMyPosts();
    }, [userData]);

    return (
        <div className="my-posts-page">
            <h1>My Posts</h1>
            <div className="posts-list">
                {posts.map(post => (
                    <Post key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
}
