import React from "react";
import LHSContent from "./components/PageContent/LHSContent";
import NavBar from "./components/NavigationBar/NavBar";
import RHSContent from "./components/PageContent/RHSContent";
import './assets/css/fonts.css';
import './assets/css/app.css';

class App extends React.Component {
    render() {
        return (
            <div>
                <NavBar />
                <main>
                    <div class="page-content">
                        <LHSContent />
                        <RHSContent />
                    </div>
                </main>
            </div>
        );
    }
}

export default App;
