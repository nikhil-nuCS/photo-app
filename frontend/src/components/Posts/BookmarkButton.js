import React from "react";
import { getHeaders } from "../../utils";

class BookmarkButton extends React.Component {
    constructor(props) {
        super(props);
        this.is_bookmarked = (typeof this.props.status !== "undefined")
        this.state = {
            postid: this.props.postID,
            isBookmarked: this.is_bookmarked,
            entryid: (typeof this.props.status !== "undefined") ? this.props.status : null
        }
        this.handleClick = this.handleClick.bind(this);
        this.bookmarkPost = this.bookmarkPost.bind(this);
        this.unbookmarkPost = this.unbookmarkPost.bind(this);
    }

    handleClick() {
        if (this.state.isBookmarked) {
            this.unbookmarkPost()
        } else {
            this.bookmarkPost()
        }
    }

    bookmarkPost() {
        var postID = this.state.postid
        var bodyData = {
          "post_id": postID
        };
      
        fetch("api/bookmarks/", {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(bodyData)
        })
          .then(response => response.json())
          .then(data => {
            console.log("Adding a bookmark ::=", data);
            this.setState({ entryid: data.id });
            this.setState({isBookmarked : true});
            this.props.reloadPost();

            var cardId = "#card-id-" + this.state.postid;
            var elem = document.querySelector(cardId);
            elem.querySelector('#card-bookmarked').focus();        

          });
    }

    unbookmarkPost() {
        if (this.state.entryid !== null) {
        fetch(`api/bookmarks/${this.state.entryid}`, {
          method: "DELETE",
          headers: getHeaders()
        })
          .then(response => response.json())
          .then(data => {
            console.log("Deleting bookmark ::=", data);
            this.setState({isBookmarked : false});
            this.props.reloadPost();

            var cardId = "#card-id-" + this.state.postid;
            var elem = document.querySelector(cardId);
            elem.querySelector('#card-unbookmarked').focus();        
          });
        }
    }

    render() {
        var component_id = this.state.isBookmarked? "card-bookmarked" : "card-unbookmarked"
        var component_class = this.state.isBookmarked ? "material-icons post-bookmarked": "material-icons"
        var icon_name = this.state.isBookmarked ?  "bookmark" : "bookmark_border"
        return (
            <button id= {component_id}
                class= {component_class}
                aria-label="Bookmark Post"
                aria-checked= {this.state.isBookmarked}
                onClick={this.handleClick}>{icon_name}</button>
        );
    }
}

export default BookmarkButton;
