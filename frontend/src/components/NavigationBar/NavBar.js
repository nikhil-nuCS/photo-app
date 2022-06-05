import React from "react";

class NavBar extends React.Component {
    render() {
        return (
            <nav class="nav-bar">
                <div class="nav-container">
                    <h1 id="nav-title">Photo App</h1>
                    <ul id="nav-items">
                        <li>
                            <a href="/api">API Docs</a>
                        </li>
                        <li><span id="nav-username">webdev</span></li>
                        <li id="app-logout"><a href="/logout">Sign out</a></li>
                    </ul>
                </div>
            </nav>);
    }
}

export default NavBar;
