import React from "react";
import { getHeaders } from "../../utils";

class NavBar extends React.Component {
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
        var usernameToDisplay = "username"
        if (this.state.userProfile !== null) {
            usernameToDisplay = this.state.userProfile.username
        }
        return (
            <nav class="nav-bar">
                <div class="nav-container">
                    <h1 id="nav-title">Photo App</h1>
                    <ul id="nav-items">
                        <li>
                            <a href="/api">API Docs</a>
                        </li>
                        <li><span id="nav-username">{usernameToDisplay}</span></li>
                        <li id="app-logout"><a href="/logout">Sign out</a></li>
                    </ul>
                </div>
            </nav>);
    }
}

export default NavBar;
