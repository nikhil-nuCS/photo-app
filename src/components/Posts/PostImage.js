import React from "react";
import "../../assets/css/posts.css";

class PostImage extends React.Component {
    render() {
        return (
            <img id="card-image" src={this.props.postImage} alt={"photo on post-"+this.props.id} />);
    }
}

export default PostImage;
