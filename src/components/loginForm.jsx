import React, { Component, useEffect } from "react";
import Joi from "joi-browser";
import { app, auth, logInWithEmailAndPassword, user } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
//import { useAuthState } from "react-firebase-hooks";
//import firebase from "../firebase";

class LoginForm extends Component {
  state = {
    data: {
      email: "",
      password: "",
    },
    errors: {},
    user: {},
  };

  // JOI FOR VALIDATION OF FORM INPUT
  schema = {
    email: Joi.string().required().email().label("Email"),
    password: Joi.string().required().label("Password"),
  };

  // VALIDATE SPECIFIC INPUT WITH JOI
  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  // ON CHANGE INPUT VALIDATION
  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;

    this.setState({ data, errors });
  };

  // VALIDATE ALL INPUT WHILE SUBMITE FORM AND RETURN ERROR IF EXISTS
  validate = () => {
    const result = Joi.validate(this.state.data, this.schema, {
      abortEarly: false,
    });
    if (!result.error) return null;

    const errors = {};
    for (let item of result.error.details) {
      errors[item.path[0]] = item.message;
      return errors;
    }
  };

  // HANDLE FORM SUBMIT WHEN SUBMIT-BUTTON CLICKED
  handleSubmit = (e) => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.doSubmit();
  };

  // SEND DATA TO FIREBASE FOR USER SIGN-IN
  doSubmit = () => {
    // console.log(this.state.data, "submitted");
    const email = this.state.data.email;
    const password = this.state.data.password;
    //const route = this.props.history.push("/home");
    logInWithEmailAndPassword(email, password);
    //this.setState({ user: auth.currentUser });

    return this.props.history.push("/home");
  };

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
  // componentDidUpdate() {
  //   let authToken = sessionStorage.getItem("Auth Token");
  //   if (authToken) {
  //     return this.props.history.replace("/home");
  //   }
  // }

  render() {
    // console.log(useAuthState(auth));
    return (
      <div className="row mt-5">
        <div className="col-3"></div>
        <div className="col">
          <h1 align="center">Log In</h1>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                onChange={this.handleChange}
                value={this.state.data.email}
                type="text"
                name="email"
                id="email"
                className="form-control"
              />
              {this.state.errors.email && (
                <div className="alert alert-danger">
                  {this.state.errors.email}
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                onChange={this.handleChange}
                value={this.state.data.password}
                type="password"
                name="password"
                id="password"
                className="form-control"
              />
              {this.state.errors.password && (
                <div className="alert alert-danger">
                  {this.state.errors.password}
                </div>
              )}
            </div>
            <button disabled={this.validate()} className="btn btn-primary">
              Login
            </button>
          </form>
        </div>
        <div className="col-3"></div>
      </div>
    );
  }
}

export default LoginForm;
