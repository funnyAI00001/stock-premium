import axios from "axios";
import { GET_ANALYTICS_DATA, SET_GETTING_CHECKOUT_SESSION } from "./types";
import { backendUrl } from "../config/url";

export const getAnalyticsData = (data) => async (dispatch) => {
  dispatch({
    type: SET_GETTING_CHECKOUT_SESSION,
    payload: { loading: true },
  });

  try {
    const res = await axios.post(
      backendUrl + "/api/admin/getAnalyticsData",
      data
    );
    const {
      activeUsers,
      newAccounts,
      pagesClicked,
      tickersSearched,
      freeUsers,
      paidUsers,
    } = res.data;

    dispatch({
      type: GET_ANALYTICS_DATA,
      payload: {
        activeUsers,
        newAccounts,
        pagesClicked,
        tickersSearched,
        freeUsers,
        paidUsers,
      },
    });
  } catch (error) {
    console.error(error.message + " in getting analytics data for admin panel");
  }

  dispatch({
    type: SET_GETTING_CHECKOUT_SESSION,
    payload: { loading: false },
  });
};

// No real admin action
export const increasePageClickCount = (data) => async (dispatch) => {
  try {
    await axios.post(backendUrl + "/api/admin/increasePageClickCount", data);
  } catch (error) {
    console.error(error.message + " in updating page click count");
  }
};
