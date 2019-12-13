// React import
import React from 'react';

//asset imports
import couch_large from './assets/_final-assets/photo-couch.jpg';
import { ReactComponent as Logo } from './assets/_final-assets/logo-endless.svg';

// Main app import
import './App.css';

class App extends React.Component {

    render() {
        return (<div className="App" >
            <div className="Header">
                <Header />
            </div>
            <div className="Promo">
                <Promo />
            </div>
            <div className="HowItWorks">
                <HowItWorks />
            </div>
        </div>
        );
    }
}

class Header extends React.Component {

    render() {
        return (
            <div className="headerLogo">
                <Logo className="endlessLogo" />
            </div>
        );
    }
}

class Promo extends React.Component {

    render() {
        return (
            <div className="promoSection">
                <img src={couch_large} alt="couch_img" />
                <div className="promoText latoText">
                    <p className="newGames">New Games & Accessories</p>
                    <p className="monthlyPackage">Monthly packages.<br/>
                        Excitement delivered daily.</p>

                    <p className="desc">What's the best way to shop for the latest video games and peripherals? How about never shopping at all?<br/>
                    You'll get new stuff on your doorstep - every month.</p>
                    <div className="latoText promoButton" >

                        <button className="latoText">
                        GET STARTED
                        </button>
                    </div>


                </div>
            </div>
        )
    }
}

class HowItWorks extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            steps: [],
        }
    };

    // Call API after page has been initially rendered
    componentDidMount() {
        this.getSteps('https://uqnzta2geb.execute-api.us-east-1.amazonaws.com/default/FrontEndCodeChallenge');
    }

    // Function to call API and format the response into the How It Works section DOM elements
    getSteps(url) {
        var that = this;
        const stepList = [];

        if (url) {
            fetch(url).then(function (response) {
                return response.json();
            }).then(function (result) {

                //Sort the returned result by stepNumber
                result.sort((a, b) => a.stepNumber - b.stepNumber);

                Object.keys(result).forEach(function (key) {
                    stepList.push(result[key]);
                })

                const stepsDOM = stepList.sort().map((data, count) => {
                    let stepHolder = [];

                    for (let j = 0; j < data.versionContent.length; j++) {
                        if (typeof stepHolder[0] == 'undefined') {
                            if (data.stepNumber < 10) {
                                data.versionContent[j].stepNumber = "0" + data.stepNumber;
                            } else {
                                data.versionContent[j].stepNumber = data.stepNumber;
                            }
                            stepHolder.push(data.versionContent[j]);
                        } else {
                            if (newerDate(data.versionContent[j].effectiveDate, stepHolder[0].effectiveDate) === data.versionContent[j].effectiveDate) {
                                if (data.stepNumber < 10) {
                                    data.versionContent[j].stepNumber = "0" + data.stepNumber;
                                } else {
                                    data.versionContent[j].stepNumber = data.stepNumber;
                                }
                                stepHolder.splice(0, 1, data.versionContent[j]);
                            }
                        }
                    }

                    return (
                        <li className="listItem" key={stepHolder[0].stepNumber}>
                            <div>{stepHolder[0].stepNumber}</div>
                            <h3>{stepHolder[0].title.toUpperCase()}</h3>
                            <p>{stepHolder[0].body}</p>
                        </li>
                    );
                });

                // Set state steps value to the new DOM element array
                that.setState({
                    steps: stepsDOM,
                });
            });

        }

    }




    render() {
        return (
            <div className="howItWorksText latoText">
                <p>How It Works</p>
                <ul>
                    {this.state.steps}
                </ul>
            </div>
        )
    }
}

// Helper function to take in two dates and compare which is more recent
function newerDate(date1, date2) {

    let d1 = new Date(date1);
    let d2 = new Date(date2);

    if (d1 > d2) {
        return date1;
    } else {
        return date2;
    }
}


export default App;
