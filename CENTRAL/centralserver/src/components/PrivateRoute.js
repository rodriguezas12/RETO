// En PrivateRoute.js

import React from "react";
import { Route, Navigate } from "react-router-dom";

const PrivateRoute = ({ element, authenticated, ...rest }) => {
  return (
    <Route
      {...rest}
      element={authenticated ? element : <Navigate to="/" replace />}
    />
  );
};

export default PrivateRoute;
