import PropTypes from 'prop-types';
import './Comments.css';

export default function Comments({ comments }) {
    return (
        <div className="comments">
            {comments.map((cmt, index) => (
                <div key={index} className="comment">
                    <p className="comment-text">{cmt.author}: {cmt.text}</p>
                    <p className="comment-date">{new Date(cmt.createdOn).toLocaleDateString()}</p>
                </div>
            ))}
        </div>
    );
}

Comments.propTypes = {
    comments: PropTypes.arrayOf(
        PropTypes.shape({
            author: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired,
            createdOn: PropTypes.number.isRequired
        })
    ).isRequired
};