import React from "react";
import BookmarkButton from "./BookmarkButton";
import LikeButton from "./LikeButton";
import "../../assets/css/PostOptions.css"

class PostOptions extends React.Component {
    render() {
        return (
            <div id="post-options">
                <div id="post-options-left">
                    <LikeButton status={this.props.info.current_user_like_id} postID={this.props.info.id} reloadPost={this.props.reloadPost} />
                    <button id="card-comment" class="material-icons">chat_bubble_outline</button>
                    <button id="card-message" class="material-icons">send</button>
                </div>

                <div id="post-options-right">
                    <BookmarkButton status={this.props.info.current_user_bookmark_id} postID={this.props.info.id} reloadPost={this.props.reloadPost} />
                </div>
            </div>
        );
    }
}

export default PostOptions;
