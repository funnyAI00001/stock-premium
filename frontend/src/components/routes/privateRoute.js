import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import LoadingOverlay from "../dialog/loadingOverlay";
import Stripe from "../../pages/stripe";

import { getExpirations, getSymbolLists, getStocks } from "../../actions/stockAction";
import { useDispatch, useSelector } from "react-redux";
import { getCheckoutSessionId } from "../../actions/stripeAction";

const PrivateRoute = ({ component: Component }) => {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const dispatch = useDispatch();
  const subscriptionStatus = useSelector(
    (state) => state.stripe.subscriptionStatus
  );
  const checkoutSessionId = useSelector(
    (state) => state.stripe.checkoutSessionId
  );
  const isGettingCheckoutSession = useSelector(
    (state) => state.stripe.isGettingCheckoutSession
  );

  useEffect(() => {
    dispatch(getExpirations());
    dispatch(getSymbolLists());
    dispatch(getStocks())
  }, [dispatch]);

  useEffect(() => {
    if (user !== undefined) {
      dispatch(getCheckoutSessionId({ user: user }));
    }
  }, [user, dispatch]);

  if (isLoading || isGettingCheckoutSession) {
    console.log("loading");
    return <LoadingOverlay text="Loading..." color="success" />;
  } else if (
    isAuthenticated &&
    checkoutSessionId !== null &&
    subscriptionStatus === "complete"
  ) {
    console.log("component");
    return <Component />;
  } else if (
    isAuthenticated &&
    (checkoutSessionId === null || subscriptionStatus !== "complete")
  ) {
    console.log("stripe");
    return <Stripe />;
  }
};

export default PrivateRoute;
