import React, { Component } from "react";
import { NavLink, Link } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import react from "react";

class NavBar extends Component {
  state = {
    uid: "",
  };
  componentDidMount() {
    onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        const uid = user.uid;
        this.setState({ uid });
      } else {
        this.setState({ uid: "" });
      }
    });
  }
  render() {
    const user = auth.currentUser;
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        {/* <Link className="navbar-brand" to="/">
          React
        </Link> */}
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            {user != null && (
              <react.Fragment>
                <NavLink className="nav-item nav-link" to="/home">
                  Dasboard
                </NavLink>
              </react.Fragment>
            )}
            {user == null && (
              <react.Fragment>
                <NavLink className="nav-item nav-link" to="/login">
                  Login
                </NavLink>
                <NavLink className="nav-item nav-link" to="/register">
                  Register
                </NavLink>
              </react.Fragment>
            )}
          </div>
        </div>
        <span className="navbar-text">React + Firebase</span>
      </nav>
    );
  }
}

export default NavBar;
