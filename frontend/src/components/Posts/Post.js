import React from "react";
import "../../assets/css/Post.css";
import { getHeaders } from "../../utils";
import PostDetails from "./PostDetails";
import PostImage from "./PostImage";
import PostInfo from "./PostInfo";
import PostPublishComment from "./PostPublishComment";

class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            postid: this.props.info.id,
            info: this.props.info
        }

        this.reloadPost = this.reloadPost.bind(this);
    }

    reloadPost() {
        fetch(`/api/posts/${this.state.postid}`, {
            headers: getHeaders()
        })
            .then(response => response.json())
            .then(data => {
                // console.log(data)
                this.setState({
                    postid: data.id,
                    info: data
                });
            });
    }

    render() {
        return (
            <div class="cardview">
                <PostInfo username={this.state.info.user.username} />
                <PostImage postImage={this.state.info.image_url} id={this.state.info.id}/>
                <PostDetails info={this.state.info} reloadPost={this.reloadPost} />
                <div id="post-divider-line"></div>
                <PostPublishComment id={this.state.info.id} reloadPost={this.reloadPost} />
            </div>
        );
    }
}

export default Post;
