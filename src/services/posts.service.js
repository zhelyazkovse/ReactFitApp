import { ref, push, get, update, remove } from 'firebase/database';
import { db } from '../config/firebase-config';

export const addPost = async (author, title, content) => {
    const postsRef = ref(db, 'posts');
    const newPostRef = push(postsRef);

    const post = {
        author,
        title,  
        content,
        createdOn: Date.now(),
        comments: [],  
        likedBy: []  
    };

    const result = await push(ref(db, 'posts'), post);
    return result.key;  
};

export const getAllPosts = async (search, sort = 'desc') => {
    const snapshot = await get(ref(db, 'posts'));
    if (!snapshot.exists()) return [];

    const posts = Object.entries(snapshot.val())
        .map(([key, value]) => ({
            ...value,
            id: key,
            likedBy: value.likedBy ? Object.keys(value.likedBy) : [],
            comments: value.comments ? Object.values(value.comments) : [],
            createdOn: value.createdOn  // Keep as number (timestamp)
        }))
        .filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase()));

    switch (sort) {
        case 'asc':
            return posts.sort((a, b) => a.createdOn - b.createdOn);
        case 'desc':
            return posts.sort((a, b) => b.createdOn - a.createdOn);
        case 'mostLiked':
            return posts.sort((a, b) => b.likedBy.length - a.likedBy.length);
        case 'mostCommented':
            return posts.sort((a, b) => b.comments.length - a.comments.length);
        default:
            return posts;
    }
};

export const likePost = async (postId, handle) => {
    const updateVal = {};
    updateVal[`users/${handle}/likedPosts/${postId}`] = true;
    updateVal[`posts/${postId}/likedBy/${handle}`] = true;

    update(ref(db), updateVal);
};

export const dislikePost = async (postId, handle) => {
    const updateVal = {};
    updateVal[`users/${handle}/likedPosts/${postId}`] = null;
    updateVal[`posts/${postId}/likedBy/${handle}`] = null;

    update(ref(db), updateVal);
};

export const deletePost = async (postId) => {
    const postRef = ref(db, `posts/${postId}`);
    return await remove(postRef);
};

export const addCommentToPost = async (postId, author, text) => {
    const comment = { author, text, createdOn: Date.now() };
    const commentsRef = ref(db, `posts/${postId}/comments`);
    const result = await push(commentsRef, comment);
    return result.key; 
};

export const getPostById = async (id) => {
    const snapshot = await get(ref(db, `posts/${id}`));
    if (!snapshot.exists()) throw new Error('Post with this id does not exist!');

    const post = snapshot.val();

    return {
        ...post,
        id,
        likedBy: post.likedBy ? Object.keys(post.likedBy) : [],
        comments: post.comments ? Object.values(post.comments) : [], // Ensure comments is an array
        createdOn: post.createdOn  // Keep as number (timestamp)
    };
};

export const updatePost = async (postId, updatedData) => {
    const postRef = ref(db, `posts/${postId}`);
    return await update(postRef, updatedData);
};

export const updateComment = async (postId, commentId, updatedText) => {
    const commentRef = ref(db, `posts/${postId}/comments/${commentId}`);
    return await update(commentRef, { text: updatedText });
};