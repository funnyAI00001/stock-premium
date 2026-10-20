import axios from "axios";
import {
  GET_STRIPE_STATUS,
  GET_PAYMENT_INTENT,
  GET_CHECKOUT_SESSION_ID,
  SET_GETTING_CHECKOUT_SESSION,
  SET_CHECKOUT_SESSION_ID,
} from "./types";
import { backendUrl } from "../config/url";

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
    const { id, status, userType } = res.data;

    dispatch({
      type: GET_CHECKOUT_SESSION_ID,
      payload: { id, status, userType },
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

export const updateCheckoutSessionId = (data) => async (dispatch) => {
  try {
    const res = await axios.post(
      backendUrl + "/api/stripe/update-checkout-session-id",
      data
    );

    const { id } = res.data;

    dispatch({
      type: SET_CHECKOUT_SESSION_ID,
      payload: { checkoutSessionId: id },
    });
  } catch (error) {
    console.log(error);
  }
};

export const createFreeTrialAccount = (data) => async () => {
  try {
    await axios.post(backendUrl + "/api/stripe/createFreeTrialAccount", data);

    window.location.href = "/earn";
  } catch (error) {
    console.error("Error creating free trial account: ", error);
  }
};
