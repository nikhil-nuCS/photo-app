import React from "react";
import "../../assets/css/PostCaption.css"

class PostCaption extends React.Component {
    render() {
        return (
            <div class="card-caption">
                <span id="caption-username">{this.props.username}</span>
                <span id="caption-text">{this.props.caption}</span>
                <label id="caption-more"><a href=""> more</a></label>
            </div>
        );
    }
}

export default PostCaption;
