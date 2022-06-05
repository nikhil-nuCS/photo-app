import React from "react";
import "../../assets/css/LikesCount.css"

class PostLikesCount extends React.Component {
    render() {
        return (
            <label id="likes-count">{this.props.likes} {this.props.likes === 1 ? "like" : "likes"}</label>
        );
    }
}

export default PostLikesCount;
