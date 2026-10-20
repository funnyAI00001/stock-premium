import axios from "axios";
import {
  STRIPE_SUCCESS,
  GET_STRIPE_STATUS,
  GET_PAYMENT_INTENT,
  GET_CHECKOUT_SESSION_ID,
  SET_GETTING_CHECKOUT_SESSION,
} from "./types";
import { backendUrl } from "../config/url";

export const handleToken =
  (totalAmount, token, user, callback) => async (dispatch) => {
    try {
      axios
        .post(backendUrl + "/api/stripe/pay", {
          token: token.id,
          amount: totalAmount,
          user: user,
        })
        .then(async (res) => {
          dispatch({
            type: STRIPE_SUCCESS,
          });

          callback && callback();
        });
    } catch (error) {
      console.log(error);
    }
  };

export const getStripeStatus = (user) => async (dispatch) => {
  try {
    axios
      .post(backendUrl + "/api/stripe/getStripeStatus", {
        user,
      })
      .then(async (res) => {
        const { stripe } = res.data;

        dispatch({
          type: GET_STRIPE_STATUS,
          payload: { stripe },
        });
      });
  } catch (error) {
    console.log(error);
  }
};

export const updateStripeStatus = (user) => async (dispatch) => {
  try {
    axios
      .post(backendUrl + "/api/stripe/updateStripeStatus", {
        user,
      })
      .then((res) => {
        const { stripe } = res.data;

        console.log("stripe after updateStripeStatus" + stripe);
        dispatch({
          type: GET_STRIPE_STATUS,
          payload: { stripe },
        });
      });
  } catch (error) {
    console.log(error);
  }
};

export const createPaymentIntent = (data) => async (dispatch) => {
  try {
    axios
      .post(backendUrl + "/api/stripe/create-payment-intent", {
        data,
      })
      .then(async (res) => {
        const { clientSecret } = res.data;

        dispatch({
          type: GET_PAYMENT_INTENT,
          payload: { clientSecret },
        });
      });
  } catch (error) {
    console.log(error);
  }
};

export const createCheckoutSession = (data) => async () => {
  try {
    const response = await axios.post(
      backendUrl + "/api/stripe/create-checkout-session",
      data
    );
    window.location.href = response.data.url;
  } catch (error) {
    console.error("Error creating checkout session:", error);
  }
};

export const createPortalSession = (data) => async () => {
  try {
    const response = await axios.post(
      backendUrl + "/api/stripe/create-portal-session",
      data
    );
    console.log("Redirecting to:", response.data.url);
    window.location.href = response.data.url;
  } catch (error) {
    console.error("Error creating checkout session:", error);
  }
};

export const getCheckoutSessionId = (data) => async (dispatch) => {
  dispatch({
    type: SET_GETTING_CHECKOUT_SESSION,
    payload: { loading: true },
  });
  try {
    const res = await axios.post(
      backendUrl + "/api/stripe/get-checkout-session-id",
      data
    );
    const { id, status } = res.data;

    dispatch({
      type: GET_CHECKOUT_SESSION_ID,
      payload: { id, status },
    });
    dispatch({
      type: SET_GETTING_CHECKOUT_SESSION,
      payload: { loading: false },
    });
  } catch (error) {
    console.error(error.message + " in getting checkout session");

    dispatch({
      type: SET_GETTING_CHECKOUT_SESSION,
      payload: { loading: false },
    });
  }
};
