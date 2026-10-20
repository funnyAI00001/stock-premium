import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";

import LoadingOverlay from "../dialog/loadingOverlay";
import Register from "../../pages/register";
import Stripe from "../../pages/stripe";

import { getExpirations } from "../../actions/stockAction";
import { useDispatch, useSelector } from "react-redux";
import { getStripeStatus } from "../../actions/stripeAction";

const PrivateRoute = ({ component: Component, getExpirations }) => {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const dispatch = useDispatch();
  const subscribe = useSelector((state) => state.stripe.subscribe);

  useEffect(() => {
    getExpirations();
  }, [getExpirations]);

  useEffect(() => {
    if (user !== undefined) {
      dispatch(getStripeStatus(user));
    }
  }, [user]);

  if (isLoading) {
    console.log("loading");
    return <LoadingOverlay text="Welcome..." color="success" />;
  } else if (isAuthenticated && !subscribe) {
    console.log("stripe");
    return <Stripe />;
  } else if (isAuthenticated && subscribe) {
    console.log("component");
    return <Component />;
  }

  return <Register />;
};

const mapDispatchToProps = (dispatch) => ({
  getExpirations: () => dispatch(getExpirations()),
});

export default connect(null, mapDispatchToProps)(PrivateRoute);
