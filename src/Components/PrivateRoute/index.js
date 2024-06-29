import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import Cookies from 'js-cookie';



const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    Cookies.get('jwt_token') ? (
      <Redirect to="/Home" />
    ) : (
      <Component {...props} />
    )
  )} />
);

export default PrivateRoute