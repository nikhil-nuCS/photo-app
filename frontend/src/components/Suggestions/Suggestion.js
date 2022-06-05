import React from "react";
import "../../assets/css/suggestion.css"
import { getHeaders } from "../../utils";

class Suggestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userid: this.props.id,
            is_followed: false,
            entryid: null
        }
        this.handleClick = this.handleClick.bind(this);
        this.followUser = this.followUser.bind(this);
        this.unfollowUser = this.unfollowUser.bind(this);
    }

    handleClick() {
        if (this.state.is_followed) {
            this.unfollowUser()
        } else {
            this.followUser()
        }
    }

    followUser() {
        var postBody = {
            "user_id": this.state.userid
          };
          fetch("/api/following", {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(postBody)
          })
            .then(response => response.json())
            .then(data => {
              console.log("Follow successful ::=", data)
              this.setState({entryid: data.id})
              this.setState({is_followed: true})
            });
        
    }

    unfollowUser() {
        if (this.state.entryid !== null) {
            fetch(`api/following/${this.state.entryid}`, {
              method: "DELETE",
              headers: getHeaders()
            })
              .then(response => response.json())
              .then(data => {
                console.log("Unfollow successful ::=", data);
                this.setState({entryid: null})
                this.setState({is_followed: false})
              });
        }
    }

    render() {
        var isFollowed = this.state.is_followed
        var component_text = isFollowed ? "unfollow" : "follow"
        var component_class = isFollowed ? "user-unfollow" : "user-follow"
        return (
            <div class="suggested-panel">
                <div id="suggestion-left">
                    <img id="suggestion-pic" src={this.props.image_url} />
                    <div id="suggested-user">
                        <span id="suggested-username"> {this.props.username} </span>
                        <span id="suggested-label">suggested for you</span>
                    </div>
                </div>
                <div id="suggestion-right">
                    <button class={component_class}
                        onClick={this.handleClick}
                        aria-label="Follow"
                        aria-checked="false">{component_text}</button>
                </div>
            </div>
        );
    }
}

export default Suggestion;
