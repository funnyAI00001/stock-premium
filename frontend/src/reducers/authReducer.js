import {
  REGISTER_SUCCESS,
  REGISTER_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  USER_LOAD,
  LOG_OUT,
} from "../actions/types";

const initialState = {
  isAuthenticated: false,
  token: null,
  credential: "",
  emailError: "",
  loading: true,
  user: { name: "user", email: "test@gmail.com" },
  registerError: "",
  categories: [],
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_SUCCESS:
      return {
        ...state,
      };

    case REGISTER_ERROR:
      return {
        ...state,
        registerError: action.payload.message,
      };

    case LOGIN_SUCCESS:
      localStorage.setItem("token", action.payload.token);

      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        user: action.payload.user,
      };

    case LOGIN_FAILURE:
      return {
        ...state,
        credential: action.payload.error,
      };

    case USER_LOAD:
      const user = JSON.parse(localStorage.getItem("user"));

      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: user,
      };

    case LOG_OUT:
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        user: {},
        courts: [],
      };

    default:
      return state;
  }
};

export default authReducer;
