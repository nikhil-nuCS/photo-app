import React from "react";
import "../../assets/css/userprofile.css";
import { getHeaders } from "../../utils";

class UserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userProfile: null
        }
    }

    componentDidMount = () => {
        fetch('/api/profile', {
            headers: getHeaders()
        })
            .then(response => response.json())
            .then(profile => {
                console.log(profile)
                this.setState({ userProfile: profile })
            })
    }

    render() {
        if (this.state.userProfile === null) {
            return <div />
        }
        return (
            <div class="user-profile">
                <img id="profile-pic" src={this.state.userProfile.thumb_url} alt="profile user" />
                <label id="profile-username"> {this.state.userProfile.username} </label>
            </div>
        );
    }
}

export default UserProfile;
