import {
  STRIPE_SUCCESS,
  GET_STRIPE_STATUS,
  GET_PAYMENT_INTENT,
  GET_CHECKOUT_SESSION_ID,
  SET_CHECKOUT_SESSION_ID,
  SET_GETTING_CHECKOUT_SESSION,
} from "../actions/types";

const initialState = {
  subscribe: false,
  clientSecret: "",
  subscriptionStatus: null,
  checkoutSessionId: null,
  isGettingCheckoutSession: false,
  userType: null,
};

const stripeReducer = (state = initialState, action) => {
  switch (action.type) {
    case STRIPE_SUCCESS:
      return {
        ...state,
        subscribe: true,
      };

    case GET_STRIPE_STATUS:
      return {
        ...state,
        subscribe: action.payload.stripe,
      };

    case GET_PAYMENT_INTENT:
      return {
        ...state,
        clientSecret: action.payload.clientSecret,
      };

    case GET_CHECKOUT_SESSION_ID:
      return {
        ...state,
        checkoutSessionId: action.payload.id,
        subscriptionStatus: action.payload.status,
        userType: action.payload.userType,
      };

    case SET_GETTING_CHECKOUT_SESSION:
      return {
        ...state,
        isGettingCheckoutSession: action.payload.loading,
      };

    case SET_CHECKOUT_SESSION_ID:
      return {
        ...state,
        checkoutSessionId: action.payload.checkoutSessionId,
      };

    default:
      return state;
  }
};

export default stripeReducer;
