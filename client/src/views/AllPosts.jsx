import { useEffect, useState, useContext } from "react";
import { getAllPosts } from "../services/posts.service.js";
import Post from "../components/Post/Post.jsx";
import { useSearchParams } from "react-router-dom";
import './AllPosts.css';
import { AppContext } from "../context/AppContext.jsx";

export default function AllPosts() {
    const [posts, setPosts] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'desc';
    const { userData } = useContext(AppContext);

    const setSearch = (value) => {
        setSearchParams({ search: value, sort });
    };

    const setSort = (value) => {
        setSearchParams({ search, sort: value });
    };

    useEffect(() => {
        getAllPosts(search, sort).then(posts => {
            setPosts(posts.map(post => ({
                ...post,
                author: post.author || 'Unknown',  // Fallback if no author is provided
                createdOn: typeof post.createdOn === 'string' ? new Date(post.createdOn).getTime() : post.createdOn || Date.now()  // Ensure createdOn is a timestamp
            })));
        });
    }, [search, sort]);

    return (
        <div className="all-posts-page">
            <h1>All posts</h1>
            <div className="filter-sort">
                <div className="search-bar">
                    <label htmlFor="search">Search:</label>
                    <input value={search} onChange={e => setSearch(e.target.value)} type="text" name="search" id="search" />
                </div>
                <div className="sort-options">
                    <label htmlFor="sort">Sort by:</label>
                    <select value={sort} onChange={e => setSort(e.target.value)} id="sort">
                        <option value="desc">Newest First</option>
                        <option value="asc">Oldest First</option>
                        <option value="mostLiked">Most Liked</option>
                        <option value="mostCommented">Most Commented</option>
                    </select>
                </div>
            </div>
            <div className="posts-list">
                {posts.map((post) => (
                    <Post key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
}