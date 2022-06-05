import React from "react";
import "../../assets/css/PostPublishComment.css"
import { getHeaders } from "../../utils";

class PostPublishComment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            postid: this.props.id
        }
        this.postComment = this.postComment.bind(this);
    }

    postComment() {
        var postid = "post-comment-" + this.state.postid;
        var inputComment = document.getElementById(postid).value;
        const bodyData = {
          "post_id": this.state.postid,
          "text": inputComment
        };
      
        fetch("api/comments", {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(bodyData)
        })
          .then(response => response.json())
          .then(data => {
            console.log("Adding a comment ::=", data);
            this.props.reloadPost();
            document.getElementById(postid).value = "";
            var elem = document.querySelector(`#card-id-${this.state.postid}`);
            elem.querySelector(".post-comment").focus();
          })
          .catch((error) => {
            console.error("Error in posting comment ::=", error);
          });       
    }

    render() {
        return (
            <div class="post-user-comments">
                <div id="card-comment-feature">
                    <span id="comment-emoji" class="material-icons">sentiment_satisfied_alt</span>
                    <input name="comment-on-post-${post.id}" aria-label="post a comment" class="post-comment" id={"post-comment-" + this.state.postid} type="text" placeholder="Add a comment ..." />
                </div>
                <button id="comment-publish" onClick={this.postComment}>Post</button>
            </div>
        );
    }
}

export default PostPublishComment;
