import React from "react";
import Story from "./Story";
import "../../assets/css/stories.css";
import { getHeaders } from "../../utils";

class Stories extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            storiesInfo: null
        }
    }

    componentDidMount = () => {
        fetch('https://photo-app-nk.herokuapp.com/api/stories', {
            headers: getHeaders()
        })
            .then(response => response.json())
            .then(stories => {
                console.log(stories)
                this.setState({ storiesInfo: stories })
            })
    }

    renderStories = () => {
        const allStories = this.state.storiesInfo.map((eachStory) => 
            <li key={eachStory.id}> <Story username={eachStory.user.username} image_url={eachStory.user.image_url} /> </li>
        );
        return allStories
    }

    render() {
        if (this.state.storiesInfo === null) {
            return <div />
        }
        return (
            <div class="stories">
                <ul class="suggestions-list"> {this.renderStories()} </ul>
            </div>
        );
    }
}

export default Stories;
