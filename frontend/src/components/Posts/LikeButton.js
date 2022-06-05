import React from "react";
import { getHeaders } from "../../utils";

class LikeButton extends React.Component {
    constructor(props) {
        super(props);
        this.is_liked = (typeof this.props.status !== "undefined")
        this.state = {
            postid: this.props.postID,
            isLiked: this.is_liked,
            entryid: (typeof this.props.status !== "undefined") ? this.props.status : null
        }
        this.handleClick = this.handleClick.bind(this);
        this.likePost = this.likePost.bind(this);
        this.unlikePost = this.unlikePost.bind(this);
    }

    handleClick() {
        if (this.state.isLiked) {
            this.unlikePost()
        } else {
            this.likePost()
        }
    }

    likePost() {
        var postID = this.state.postid
        var bodyData = {
            "post_id": postID
        };

        fetch("api/posts/likes/", {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(bodyData)
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ entryid: data.id })
                this.setState({isLiked : true});
                console.log("Liking a Post ::=", data);
                this.props.reloadPost();

                var cardId = "#card-id-" + this.state.postid;
                var elem = document.querySelector(cardId);
                elem.querySelector('#card-liked').focus();        
            });
    }

    unlikePost() {
        if (this.state.entryid !== null) {
            console.log(this.state.entryid)
            fetch(`api/posts/likes/${this.state.entryid}`, {
                method: "DELETE",
                headers: getHeaders()
            })
                .then(response => response.json())
                .then(data => {
                    this.setState({ entryid: null })
                    this.setState({isLiked : false});
                    console.log("Liked -> Unlike Post :==", data);
                    this.props.reloadPost();

                    var cardId = "#card-id-" + this.state.postid;
                    var elem = document.querySelector(cardId);
                    elem.querySelector('#card-noliked').focus();        
                });
        }
    }

    render() {
        var component_id = this.state.isLiked ? "card-liked" : "card-noliked"
        var component_class = this.state.isLiked ? "material-icons post-liked" : "material-icons"
        var icon_name = this.state.isLiked ? "favorite" : "favorite_border"

        return (
            <button id={component_id}
                aria-label="Like Post"
                aria-checked={this.state.isLiked}
                class={component_class}
                onClick={this.handleClick}>{icon_name}</button>
        );
    }
}

export default LikeButton;
