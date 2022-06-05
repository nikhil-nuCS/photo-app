import React from "react";
import "../../assets/css/posts.css";
import { getHeaders } from "../../utils";
import Post from "./Post";

class Posts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            postsInfo: null
        }
    }
    componentDidMount = () => {
        fetch('/api/posts/?limit=10', {
            headers: getHeaders()
        })
            .then(response => response.json())
            .then(posts => {
                console.log(posts)
                this.setState({ postsInfo: posts })
            })
    }

    renderPosts = () => {
        const allStories = this.state.postsInfo.map((eachPost) => 
            <li class="card-item" id={"card-id-"+eachPost.id}> <Post key={eachPost.id} id={eachPost.id} info={eachPost} /> </li>
        );
        return allStories
    }

    render() {
        if (this.state.postsInfo === null) {
            return <div />
        }

        return (
            <div class="posts">
                <ul class="card-list"> {this.renderPosts()} </ul>
            </div>
        );
    }
}

export default Posts;
