import React, { Component } from "react";
import Joi from "joi-browser";
import { auth, registerWithEmailAndPassword } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

class RegisterForm extends Component {
  state = {
    data: {
      fname: "",
      lname: "",
      email: "",
      //mobile: "",
      pass: "",
      conpass: "",
    },
    errors: {},
  };

  // JOI FOR VALIDATION OF FORM INPUT
  schema = {
    fname: Joi.string().required().label("Firstname"),
    lname: Joi.string().required().label("Lastname"),
    email: Joi.string().required().email().label("Email"),
    pass: Joi.string().required().min(6).label("Password"),
    conpass: Joi.string().required().min(6).label("Confirm password"),
  };

  // VALIDATE SPECIFIC INPUT WITH JOI
  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);

    if (error) {
      if (name === "conpass") {
        const password = this.state.data.pass;
        const confirm = value;

        //console.log(error, "pass");
        return password !== confirm
          ? "Password and Confirm-password should be same!"
          : error.details[0].message;
      }

      // console.log(name, value, ">>>>>>>>>>");
      return error.details[0].message;
    } else {
      return null;
    }
    //return error ? error.details[0].message : null;
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
    // console.log(errors, "data");
  };

  // VALIDATE ALL INPUT WHILE SUBMIT FORM AND RETURN ERROR IF EXISTS
  validate = () => {
    const result = Joi.validate(this.state.data, this.schema, {
      abortEarly: false,
    });
    //console.log(result.error.details, "validate");
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

  // SEND DATA TO FIREBASE FOR USER REGIESTRATION
  doSubmit = () => {
    // Call the server
    // console.log(this.state.data, "Submitted");
    const name = `${this.state.data.fname}-${this.state.data.lname}`;
    console.log(name);

    registerWithEmailAndPassword(
      name,
      this.state.data.email,
      this.state.data.pass
    );

    // reset form input data after submiting
    let data = { ...this.state.data };
    data.fname = "";
    data.lname = "";
    data.email = "";
    data.pass = "";
    data.conpass = "";

    this.setState({ data });

    //return this.props.history.push("/home");
  };

  componentDidMount() {
    onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        // redirect to home-page when user logged in
        return this.props.history.replace("/home");
      } else {
        // redirect to login-page when user logged out
        // return this.props.history.replace("/register");
      }
    });
  }
  render() {
    return (
      <div className="row mt-5">
        <div className="col-3"></div>
        <div className="col">
          <h1 align="center">Register User</h1>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="fname">Firstname</label>
              <input
                onChange={this.handleChange}
                value={this.state.data.fname}
                type="text"
                name="fname"
                id="fname"
                className="form-control"
              />
              {this.state.errors.fname && (
                <div className="alert alert-danger">
                  {this.state.errors.fname}
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="lname">Lastname</label>
              <input
                onChange={this.handleChange}
                value={this.state.data.lname}
                type="text"
                name="lname"
                id="lname"
                className="form-control"
              />
              {this.state.errors.lname && (
                <div className="alert alert-danger">
                  {this.state.errors.lname}
                </div>
              )}
            </div>

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
              <label htmlFor="pass">Password</label>
              <input
                onChange={this.handleChange}
                value={this.state.data.pass}
                type="password"
                name="pass"
                id="pass"
                className="form-control"
              />
              {this.state.errors.pass && (
                <div className="alert alert-danger">
                  {this.state.errors.pass}
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="conpass">Confirm password</label>
              <input
                onChange={this.handleChange}
                value={this.state.data.conpass}
                type="password"
                name="conpass"
                id="conpass"
                className="form-control"
              />
              {this.state.errors.conpass && (
                <div className="alert alert-danger">
                  {this.state.errors.conpass}
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

export default RegisterForm;
