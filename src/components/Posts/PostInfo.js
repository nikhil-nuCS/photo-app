import React from "react";
import "../../assets/css/PostInfo.css"

class PostInfo extends React.Component {
    render() {
        return (
            <div class="card-header">
                <label id="card-publisher"> { this.props.username } </label>
                <span class="material-icons" > more_horiz </span>
            </div>
        );
    }
}

export default PostInfo;
