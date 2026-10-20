import React, { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { createPaymentIntent } from "../actions/stripeAction";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useTheme } from "@emotion/react";

import CheckoutForm from "../components/stripe/checkoutform";
import Grid from "@mui/material/Grid";

import { Button, useMediaQuery } from "@mui/material";

const stripePromise = loadStripe(
  "pk_test_51OlQvLB0gv0feBVJ3Cu584iBuSegRgfX0EItlQa7ojixicP410l6hQHhkZMvkxayUd8BmNnafqccLHJifB5xYehC00zegezkrH"
);

const Stripe = () => {
  const dispatch = useDispatch();
  const clientSecret = useSelector((state) => state.stripe.clientSecret);
  const navigate = useNavigate();
  const theme = useTheme();

  const { logout } = useAuth0();
  const isSmScreen = useMediaQuery("(min-width:600px)");

  const onLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const data = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
    };
    dispatch(createPaymentIntent(data));
  }, []);

  const subscribe = useSelector((state) => state.stripe.subscribe);

  useEffect(() => {
    if (subscribe) {
      navigate("/shortlist");
    }
    console.log(subscribe);
  }, [subscribe]);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Grid container spacing={0} marginLeft={isSmScreen ? "-130px" : ""}>
      <Grid item xs={12}>
        <Button
          variant="outlined"
          sx={{
            float: "right",
            marginTop: 3,
            color: "white",
            borderColor: theme.palette.text.third,
            marginRight: isSmScreen ? "-100px" : "",
          }}
          onClick={() => onLogout()}
        >
          Log Out
        </Button>
      </Grid>
      <Grid item xs={0} md={3}></Grid>
      <Grid
        item
        xs={12}
        md={6}
        mt={20}
        display="flex"
        justifyContent="center"
        color="white"
      >
        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        )}
      </Grid>
      <Grid item xs={0} md={3}></Grid>
    </Grid>
  );
};

export default Stripe;
