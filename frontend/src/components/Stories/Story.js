import React from "react";

class Story extends React.Component {
    render() {
        return (
            <div>
                <div id="image-background">
                    <img src={this.props.image_url} class="story-pic" alt="profile pic for ${story.user.username }" />
                </div>
                <p> {this.props.username} </p>
            </div>
        );
    }
}

export default Story;
