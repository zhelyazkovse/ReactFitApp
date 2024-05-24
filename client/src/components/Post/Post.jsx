import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './Post.css';

export default function Post({ post }) {
    return (
        <div className="post">
            <h2 className="post-title">
                <Link to={`/posts/${post.id}`}>{post.title}</Link>
            </h2>
            <p className="post-author-date">
                Posted by {post.author} on {new Date(post.createdOn).toLocaleDateString()}
            </p>
        </div>
    );
}

Post.propTypes = {
    post: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        author: PropTypes.string,  // Author is not required, could be undefined
        createdOn: PropTypes.number  // Assuming createdOn is a timestamp in milliseconds
    }).isRequired,
};