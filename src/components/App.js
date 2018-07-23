import React, { Component } from "react";
import MainPage from "./MainPage";
import logo from "../images/marvel.png";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  //rechargement de la page
  update(){
    window.location.reload();
  }

  render() {
    return <div>
        <header>
          <img onClick={this.update} className="logo" src={logo} alt="logo" />
        </header>

        <MainPage />

        <footer>
          <p>
            Created by Vincent Ballut for <a href="https://www.peaks.fr/home/">
              Peaks
            </a>
          </p>
        </footer>
      </div>;
  }
}

export default App;
