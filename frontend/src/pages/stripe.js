import React, { useState, useEffect } from "react";
import "../App.css";
import { useDispatch, useSelector } from "react-redux";
import {
  createCheckoutSession,
  updateCheckoutSessionId,
  createFreeTrialAccount,
  createPortalSession,
} from "../actions/stripeAction";
import { useAuth0 } from "@auth0/auth0-react";
import { useMediaQuery, Grid, Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router";

const SuccessDisplay = ({ sessionId, user }) => {
  const { logout } = useAuth0();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSmScreen = useMediaQuery("(min-width:600px)");
  const containerStyle = isSmScreen
    ? {
        paddingLeft: 0,
        paddingRight: 0,
        marginLeft: -130,
        marginRight: 130,
      }
    : {};

  const onLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  useEffect(() => {
    if (user) {
      dispatch(
        updateCheckoutSessionId({
          user,
          checkoutSessionId: sessionId,
        })
      );
    }
  }, [sessionId, user]);

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
            background: "text.third",
            marginRight: isSmScreen ? "-100px" : "",
            "&:hover": {
              borderColor: "text.third",
            },
          }}
          onClick={() => onLogout()}
        >
          Log Out
        </Button>
      </Grid>
      <Grid item xs={12} textAlign="center" marginTop={18}>
        <Logo />
      </Grid>
      <Grid item xs={12}>
        <Typography textAlign="center" marginTop={5}>
          Subscription to starter plan successful!
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        justifyContent="center"
        display="flex"
        flexDirection={"column"}
        alignItems={"center"}
        marginTop={5}
      >
        <Button
          id="checkout-and-portal-button"
          variant="outlined"
          sx={{
            backgroundColor: "text.third",
            color: "white",
            width: isSmScreen ? "30%" : "60%",
            marginBottom: 2,
            "&:hover": {
              backgroundColor: "text.third",
              borderColor: "white",
            },
          }}
          onClick={
            //   // () => dispatch(getCheckoutSessionId({ user: user }))
            //   // () => dispatch(createPortalSession({ session_id: sessionId }))
            () => dispatch(createPortalSession({ user: user }))
          }
        >
          Manage your billing information
        </Button>
        <Button
          id="go_to_shortlist"
          variant="outlined"
          sx={{
            width: isSmScreen ? "30%" : "60%",
            backgroundColor: "text.third",
            color: "white",
            "&:hover": {
              backgroundColor: "text.third",
              borderColor: "white",
            },
          }}
          onClick={() => {
            navigate("/shortlist");
          }}
        >
          Go to shortlist
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
  const navigate = useNavigate();
  const { user } = useAuth0();
  const isSmScreen = useMediaQuery("(min-width:600px)");
  const subscriptionStatus = useSelector(
    (state) => state.stripe.subscriptionStatus
  );
  const containerStyle = isSmScreen
    ? {
        paddingLeft: 0,
        paddingRight: 0,
        marginLeft: -130,
        marginRight: 130,
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
        style={{ marginTop: 80, textAlign: "center" }}
      >
        <Logo />

        <Typography variant="h2" mb={1}>
          Thank you for creating a free account.
        </Typography>
        <Typography variant="body1" mb={3}>
          You can now save your favorite tickers to a shortlist!
        </Typography>
        <h2 style={{ color: "white" }}>COVERD Premium</h2>
        {subscriptionStatus === null && (
          <>
            <Typography variant="body1" mt={3} px={isSmScreen ? 40 : 4}>
              Sign up for the COVERD Premium Free Trial to get full access to
              advanced filters and search options to find better trades in less
              time. No credit card required! The trial ends automatically after
              7 days.
            </Typography>
            <Button
              variant="outlined"
              sx={{
                backgroundColor: "text.third",
                color: "white",
                marginTop: 2,
                marginBottom: 2,
                "&:hover": {
                  backgroundColor: "text.third",
                  borderColor: "white",
                },
              }}
              onClick={() => {
                dispatch(createFreeTrialAccount({ user: user }));
              }}
            >
              Free Trial
            </Button>
          </>
        )}

        <Typography variant="body1" px={isSmScreen ? 40 : 4}>
          Are you already convinced that Premium will make you money? Lock in
          your paid subscription now at a discounted rate. You will get
          grandfathered in no matter what we decide to charge in the future.
        </Typography>
        <h3 style={{ color: "white" }}>$19.00 / month</h3>
      </Grid>
      <Box
        textAlign="center"
        margin="auto"
        display="flex"
        flexDirection="column"
        gap={2}
      >
        {/* Add a hidden field with the lookup_key of your Price */}
        {/* <input type="hidden" name="lookup_key" value="{{PRICE_LOOKUP_KEY}}" /> */}
        <Button
          variant="outlined"
          sx={{
            backgroundColor: "text.third",
            color: "white",
            "&:hover": { backgroundColor: "text.third", borderColor: "white" },
            marginBottom: 2,
          }}
          onClick={() => {
            dispatch(createCheckoutSession({ user: user }));
          }}
        >
          Subscribe
        </Button>
        {subscriptionStatus === "trial_expired" && (
          <Button
            variant="outlined"
            sx={{
              backgroundColor: "text.third",
              color: "white",
              "&:hover": {
                backgroundColor: "text.third",
                borderColor: "white",
              },
            }}
            onClick={() => {
              navigate(-1);
            }}
          >
            Go back
          </Button>
        )}
      </Box>
    </Grid>
  );
};

const Message = ({ message }) => (
  <section>
    <p style={{ textAlign: "center" }}>{message}</p>
  </section>
);

const Logo = () => (
  <img src="/logo.png" width={110} alt="logo" loading="lazy"></img>
);

export default function Stripe() {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [sessionId, setSessionId] = useState("");
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
    }

    if (query.get("canceled")) {
      setSuccess(false);
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, [sessionId, dispatch, user]);

  useEffect(() => {
    if (subscriptionStatus === "complete" && checkoutSessionId !== null) {
      navigate("/shortlist");
    }
  }, [subscriptionStatus, checkoutSessionId, navigate]);

  if (!success && message === "") {
    return <ProductDisplay />;
  } else if (success && sessionId !== "") {
    return <SuccessDisplay sessionId={sessionId} user={user} />;
  } else {
    return <Message message={message} />;
  }
}
