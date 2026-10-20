import axios from "axios";
import {
  LOGIN_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_ERROR,
  LOGIN_FAILURE,
  USER_LOAD,
  LOG_OUT,
} from "./types";
import { backendUrl } from "../config/url";

export const checkUser = (user) => async (dispatch) => {
  try {
    await axios.post(backendUrl + "/api/auth/checkUser", user);

    dispatch({
      type: REGISTER_ERROR,
      payload: { message: null },
    });
  } catch (err) {
    if (err.response.data.message === undefined) {
      dispatch({
        type: REGISTER_ERROR,
        payload: { message: "Server Error!" },
      });
    } else {
      dispatch({
        type: REGISTER_ERROR,
        payload: { message: err.response.data.message },
      });
    }
  }
};

export const registerUser = (user, history) => async (dispatch) => {
  try {
    await axios.post(backendUrl + "/api/auth/register", user);

    dispatch({
      type: REGISTER_SUCCESS,
    });

    history("/login");
  } catch (err) {
    if (err.response.message === undefined) {
      dispatch({
        type: REGISTER_ERROR,
        payload: { message: "Server Error!" },
      });
    } else {
      dispatch({
        type: REGISTER_ERROR,
        payload: { message: err.response.message },
      });
    }
  }
};

export const loginUser = (user, history) => (dispatch) => {
  if (user.email === "" || user.password === "") {
    dispatch({
      type: LOGIN_FAILURE,
      payload: { error: "Please fill out all fields!" },
    });

    return;
  }
  axios
    .post(backendUrl + "/api/auth/login", user)
    .then((res) => {
      const { token, user, courts } = res.data;

      dispatch({
        type: LOGIN_SUCCESS,
        payload: { token, user, courts },
      });

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      history("/shortlist");
    })
    .catch((err) => {
      let error = "";

      if (err.response === undefined) {
        // Server error
        error = err.message;
      } else {
        error = err.response.data.message;
      }

      dispatch({
        type: LOGIN_FAILURE,
        payload: { error },
      });
    });
};

export const loadUser = () => (dispatch) => {
  dispatch({
    type: USER_LOAD,
  });
};

export const logOut = (history) => (dispatch) => {
  dispatch({
    type: LOG_OUT,
  });

  history("/login");
};

export const trackVisitor = (data) => async (dispatch) => {
  try {
    await axios.post(backendUrl + "/api/auth/trackVisitor", data);

    console.log("unknow user has been tracked successfully!");
  } catch (err) {
    if (err.response.data.message === undefined) {
      console.log("Server error");
    } else {
      console.log(err.response.data.message);
    }
  }
};
