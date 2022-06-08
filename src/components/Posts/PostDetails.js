import React from "react";
import "../../assets/css/PostDetails.css";
import Comments from "./Comments";
import PostCaption from "./PostCaption";
import DisplayDate from "./DisplayDate";
import PostLikesCount from "./LikesCount";
import PostOptions from "./PostOptions";

class PostDetails extends React.Component {
    render() {
        return (
            <div class="card-details">
                <PostOptions info={this.props.info} reloadPost = {this.props.reloadPost} />
                <PostLikesCount likes={this.props.info.likes.length} />
                <PostCaption username={this.props.info.user.username} caption={this.props.info.caption} />
                <DisplayDate displayTime={this.props.info.display_time} />
                <Comments comments={this.props.info.comments} />
            </div>
        );
    }
}

export default PostDetails;
