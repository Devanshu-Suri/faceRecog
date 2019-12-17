import React, { Component } from "react";
import Navigation from "./Component/Navigation/Navigation";
import Logo from "./Component/Logo/Logo";
import ImageLinkForm from "./Component/ImageLinkForm/ImageLinkForm";
import Rank from "./Component/Rank/Rank";
import FaceRecognition from "./Component/FaceRecognition/FaceRecognition";
import Particles from "react-particles-js";
import "./App.css";
import Clarifai from "clarifai";
import Signin from "./Component/Singin/Signin";
import Register from "./Component/Register/Register";
const app = new Clarifai.App({
  apiKey: "6191b90013aa4d588363031460f5c8d4"
});
const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
};
export default class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      box: {},
      route: "signin",
      isSignedIn: false
    };
  }
  CalculateFaceLocation = data => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height
    };
  };
  displayFaceBox = box => {
    console.log(box);
    this.setState({ box });
    console.log(box);
  };
  onInputChange = event => {
    this.setState({ input: event.target.value });
  };
  onRouteChanges = route => {
    if (route === "signout") {
      this.setState({ isSignedIn: false });
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route });
  };
  onButtonSubmit = () => {
    console.log("click");
    this.setState({ imageUrl: this.state.input });
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response =>
        this.displayFaceBox(this.CalculateFaceLocation(response))
      )
      .catch(err => console.log(err));
  };

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;

    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChanges={this.onRouteChanges}
        />
        {route === "home" ? (
          <div>
            <Logo />
            <Rank />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
        ) : route === "signin" ? (
          <Signin
            loadUser={this.loadUser}
            onRouteChanges={this.onRouteChanges}
          />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChanges={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}
