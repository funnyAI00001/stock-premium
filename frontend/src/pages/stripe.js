import React, { useState, useEffect } from "react";
import "../App.css";
import { useDispatch } from "react-redux";
import {
  createCheckoutSession,
  createPortalSession,
  getCheckoutSessionId,
} from "../actions/stripeAction";
import { useAuth0 } from "@auth0/auth0-react";
import { useMediaQuery, Grid, Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const SuccessDisplay = ({ sessionId }) => {
  const dispatch = useDispatch();
  const { logout, user } = useAuth0();
  const isSmScreen = useMediaQuery("(min-width:600px)");
  const containerStyle = isSmScreen
    ? {
        paddingLeft: 0,
        paddingRight: 0,
        marginLeft: "-120px",
        marginRight: -120,
      }
    : {};

  const onLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <Grid container spacing={0} style={containerStyle}>
      <Grid item xs={12}>
        <Button
          variant="outlined"
          sx={{
            float: "right",
            marginTop: 3,
            color: "white",
            borderColor: "text.third",
            marginRight: isSmScreen ? "-100px" : "",
          }}
          onClick={() => onLogout()}
        >
          Log Out
        </Button>
      </Grid>
      <Grid item xs={12} textAlign="center">
        <Logo />
      </Grid>
      <Grid item xs={12}>
        <Typography textAlign="center" marginTop={5}>
          Subscription to starter plan successful!
        </Typography>
      </Grid>
      <Grid item xs={12} justifyContent="center" display="flex" marginTop={5}>
        <Button
          id="checkout-and-portal-button"
          variant="outlined"
          sx={{
            backgroundColor: "text.third",
            color: "white",
            "&:hover": {
              backgroundColor: "text.third",
              borderColor: "white",
            },
          }}
          // onClick={
          //   // () => dispatch(getCheckoutSessionId({ user: user }))
          //   // () => dispatch(createPortalSession({ session_id: sessionId }))
          //   () => dispatch(createPortalSession({ user: user }))
          // }
        >
          Manage your billing information
        </Button>
      </Grid>
    </Grid>
  );
};

const ProductDisplay = () => {
  const { logout } = useAuth0();
  const onLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };
  const dispatch = useDispatch();
  const { user } = useAuth0();
  const isSmScreen = useMediaQuery("(min-width:600px)");
  const containerStyle = isSmScreen
    ? {
        paddingLeft: 0,
        paddingRight: 0,
        marginLeft: -120,
        marginRight: 120,
      }
    : {};

  return (
    <Grid container style={containerStyle}>
      <Grid item xs={12}>
        <Button
          variant="outlined"
          sx={{
            float: "right",
            marginTop: 3,
            color: "white",
            borderColor: "text.third",
            marginRight: isSmScreen ? "-100px" : "",
          }}
          onClick={() => onLogout()}
        >
          Log Out
        </Button>
      </Grid>
      <Grid
        item
        xs={12}
        className="product"
        style={{ marginTop: 150, textAlign: "center" }}
      >
        <Logo />
        <div className="description">
          <h2 style={{ color: "white" }}>COVERD Premium</h2>
          <Typography variant="body1">
            with life-time discount <br></br>for a limited time
          </Typography>
          <h3 style={{ color: "white" }}>$19.00 / month</h3>
        </div>
      </Grid>
      <Box textAlign="center" margin="auto">
        {/* Add a hidden field with the lookup_key of your Price */}
        {/* <input type="hidden" name="lookup_key" value="{{PRICE_LOOKUP_KEY}}" /> */}
        <Button
          variant="outlined"
          sx={{
            backgroundColor: "text.third",
            color: "white",
            "&:hover": { backgroundColor: "text.third", borderColor: "white" },
          }}
          onClick={() => {
            dispatch(createCheckoutSession({ user: user }));
          }}
        >
          Subscribe
        </Button>
      </Box>
    </Grid>
  );
};

const Message = ({ message }) => (
  <section>
    <p style={{ textAlign: "center" }}>{message}</p>
  </section>
);

const Logo = () => <img src="/logo.png" width={110}></img>;

export default function Stripe() {
  const [message, setMessage] = useState("");
  let [success, setSuccess] = useState(false);
  let [sessionId, setSessionId] = useState("");
  const { user } = useAuth0();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const subscriptionStatus = useSelector(
    (state) => state.stripe.subscriptionStatus
  );
  const checkoutSessionId = useSelector(
    (state) => state.stripe.checkoutSessionId
  );

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setSuccess(true);
      setSessionId(query.get("session_id"));

      dispatch(getCheckoutSessionId({ user: user }));
    }

    if (query.get("canceled")) {
      setSuccess(false);
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, [sessionId]);

  useEffect(() => {
    if (subscriptionStatus === "complete" && checkoutSessionId !== null) {
      navigate("/shortlist");
    }
  }, [subscriptionStatus, checkoutSessionId]);

  if (!success && message === "") {
    return <ProductDisplay />;
  } else if (success && sessionId !== "") {
    return <SuccessDisplay sessionId={sessionId} />;
  } else {
    return <Message message={message} />;
  }
}
