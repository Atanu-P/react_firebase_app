import React, { Component, useState, useEffect } from "react";
import { auth, logout, db, uid } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = { uid: "", email: "", name: "", data: {} };
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // console.log(
        //   ">>>>>>>mount",
        //   user.uid,
        //   user.email,
        //   user.displayName,
        //   user.emailVerified
        // );
        // STORE USER DATA IN LOCAL STATE FROM FIREBASE WHEN USER SIGN-IN
        this.state.uid = user.uid;
        this.state.email = user.email;
        this.state.name = user.displayName;
        this.state.data = user;
        // console.log(user, "from firebase");
      } else {
        // REMOVE USER DATA FROM LOCAL STATE WHEN USER LOGOUT
        this.state.uid = "";
        this.state.email = "";
        this.state.name = "";
        // console.log("signout");
      }
    });
    // console.log(this.state, "firestore 2");
  }

  componentDidMount() {
    onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        // redirect to home-page when user logged in
        return this.props.history.replace("/home");
      } else {
        // redirect to login-page when user logged out
        return this.props.history.replace("/login");
      }
    });
  }

  // HANDLE LOGOUT WHEN LOGOUT BUTTON CLICKED
  handleLogout = () => {
    logout();
  };

  render() {
    // if (this.state.uid) {
    //   // to check user data properly fetch from firebase
    //   console.log(this.state.data, "render");
    // }

    return (
      <div className="jumbotron mt-5">
        <h1 className="display-4">Welcome {this.state.name} !</h1>
        <h4 className="display-6">Email id: {this.state.email} </h4>
        <hr className="my-5"></hr>
        <button className="btn btn-danger btn-lg" onClick={this.handleLogout}>
          Logout
        </button>
      </div>
    );
  }
}

export default Home;
