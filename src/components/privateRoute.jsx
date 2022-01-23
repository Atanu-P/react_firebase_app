import React from "react";
import { auth } from "../firebase";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const user = auth.currentUser;

  return (
    <Route
      {...rest}
      render={(props) => {
        return user ? <Component {...props} /> : <Redirect to="/login" />;
      }}></Route>
  );
};

export default PrivateRoute;
