//mport logo from './logo.svg';
import react from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import NavBar from "./components/navBar";
import LoginForm from "./components/loginForm";
import RegisterForm from "./components/registerForm";
import Home from "./components/home";
import PrivateRoute from "./components/privateRoute";
import "./App.css";
import { auth } from "./firebase";

function App() {
  return (
    <react.Fragment>
      <main role="main" className="container">
        <NavBar></NavBar>

        <Switch>
          <Route exact path="/login" component={LoginForm} />
          <Route exact path="/register" component={RegisterForm} />
          <Route exact path="/home" component={Home} />
          <Redirect from="/" exact to="/login" />
          {/* <Route path="/movies" component={Movies} />
          <Route path="/customers" component={Customers} />
          <Route path="/rentals" component={Rentals} />
          <Route path="/not-found" component={NotFound} /> */}
          {/* <Redirect to="/not-found" />  */}
        </Switch>
      </main>
    </react.Fragment>
  );
}

export default App;
