import React from "react";
import "../../assets/css/Comments.css"

class Comments extends React.Component {
    render() {
        if (this.props.comments.length === 0) {
            return ( 
                <div></div>
            );
        }
        else if (this.props.comments.length > 1) {
            return (
                <div>
                    <button id="view-all-comments">View all {this.props.comments.length} comments</button>
                    <div id="post-comment-card">
                        <span id="comment-username"> {this.props.comments.at(-1).user.username} </span>
                        <span id="comment-text"> {this.props.comments.at(-1).text} </span>
                    </div>
                    <span id="comment-date"> {this.props.comments.at(-1).display_time} </span>
                </div>
            );
        }
        return (
            <div id="post-comment-card">
                <span id="comment-username"> {this.props.comments.at(-1).user.username} </span>
                <span id="comment-text"> {this.props.comments.at(-1).text} </span>
            </div>
        );
    }
}

export default Comments;
