import React from "react";
import SuggestionsTitle from "./SuggestionsTitle";
import "../../assets/css/suggestions.css"
import Suggestion from "./Suggestion";
import { getHeaders } from "../../utils";

class Suggestions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            suggestions: null
        }
    }

    componentDidMount = () => {
        fetch('/api/suggestions', {
            headers: getHeaders()
        })
            .then(response => response.json())
            .then(response_suggestions => {
                console.log(response_suggestions)
                this.setState({ suggestions: response_suggestions })
            })
    }
    renderSuggestions = () => {
        var currentSuggestions = this.state.suggestions
        const allSuggestions = currentSuggestions.map((eachSuggestion) =>
            <li id="suggestion-item"> <Suggestion key={eachSuggestion.id} id={eachSuggestion.id} username={eachSuggestion.username} image_url={eachSuggestion.image_url} /> </li>
        );
        return allSuggestions
    }
    render() {
        if (this.state.suggestions === null) {
            return <div />
        }
        return (
            <div class="user-suggestions">
                <SuggestionsTitle />
                <div class="suggestions-panel">
                    <ul class="suggestions-list"> {this.renderSuggestions()} </ul>
                </div>
            </div>
        );
    }
}

export default Suggestions;
