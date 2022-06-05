import React from "react";
import "../../assets/css/DisplayDate.css"

class DisplayDate extends React.Component {
    render() {
        return (
            <span id="card-date">{this.props.displayTime}</span>
        );
    }
}

export default DisplayDate;
