import React from "react";
import Posts from "../Posts/Posts";
import Stories from "../Stories/Stories";

class LHSContent extends React.Component {
    render() {
        return (
            <div class="left-column">
                <Stories />
                <Posts />
            </div>
        );
    }
}

export default LHSContent;
