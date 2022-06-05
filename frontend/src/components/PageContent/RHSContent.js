import React from "react";
import Suggestions from "../Suggestions/Suggestions";
import UserProfile from "../UserProfile/UserProfile";

class RHSContent extends React.Component {
    render() {
        return (
            <div class="right-column">
                <UserProfile />
                <Suggestions />
            </div>
        );
    }
}

export default RHSContent;
