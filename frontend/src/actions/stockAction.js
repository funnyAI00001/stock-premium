import axios from "axios";
import {
  GET_COVEREDCALLPREMIUM,
  SYMBOL_NOT_FOUND_ERROR,
  OPTIONS_NOT_FOUND_ERROR,
  GET_EXPIRATIONS,
  SERVICE_UNAVAILABLE_ERROR,
  SERVER_ERROR,
  GET_CATEGORY,
  SET_SELECTED_SYMBOLS_FOR_CALCULATION,
  SET_OTM_PERCENTAGES,
  SET_WEEKLY_EXPIRY_DATES,
  GET_SYMBOLLISTS,
  GET_BASIC_FILTER_RESULTS,
} from "./types";
import { backendUrl } from "../config/url";

export const getCoveredCallPremium = (data, callback) => async (dispatch) => {
  try {
    await axios
      .post(backendUrl + "/api/stock/getCoveredcallPremium", data)
      .then((res) => {
        const {
          sharePrices,
          ATMs,
          OTM5s,
          OTM10s,
          strikeATMs,
          strikeOTM5s,
          strikeOTM10s,
          ROIs,
          annualROIs,
          OTM5ROIs,
          OTM5annualROIs,
          OTM10ROIs,
          OTM10annualROIs,
          expiration_date,
          available_symbols
        } = res.data;

        dispatch({
          type: GET_COVEREDCALLPREMIUM,
          payload: {
            sharePrices,
            ATMs,
            OTM5s,
            OTM10s,
            strikeATMs,
            strikeOTM5s,
            strikeOTM10s,
            ROIs,
            annualROIs,
            OTM5ROIs,
            OTM5annualROIs,
            OTM10ROIs,
            OTM10annualROIs,
            expiration_date,
            available_symbols
          },
        });

        callback && callback();
      })
      .catch((err) => {
        if (err.response !== undefined) {
          console.log(err.response.data.message);
          if (err.response.data.message === "Data not found for symbol") {
            dispatch({
              type: SYMBOL_NOT_FOUND_ERROR,
              payload: { message: true },
            });

            setTimeout(() => {
              dispatch({
                type: SYMBOL_NOT_FOUND_ERROR,
                payload: { message: false },
              });
            }, 3000);
          } else if (
            err.response.data.message === "Error in fetching options chain"
          ) {
            dispatch({
              type: OPTIONS_NOT_FOUND_ERROR,
              payload: { message: true },
            });

            setTimeout(() => {
              dispatch({
                type: OPTIONS_NOT_FOUND_ERROR,
                payload: { message: false },
              });
            }, 3000);
          } else if (err.response.data.message === "service not available") {
            dispatch({
              type: SERVICE_UNAVAILABLE_ERROR,
              payload: {
                message: false,
              },
            });

            setTimeout(() => {
              dispatch({
                type: SERVICE_UNAVAILABLE_ERROR,
                payload: { message: false },
              });
            }, 3000);
          }
        } else {
          dispatch({
            type: SERVER_ERROR,
            payload: { message: true },
          });

          setTimeout(() => {
            dispatch({
              type: SERVER_ERROR,
              payload: { message: false },
            });
          }, 3000);
        }

        callback && callback();
      });
  } catch (err) {
    console.log(err);
    dispatch({
      type: SERVER_ERROR,
      payload: { message: "server error" },
    });
  }
};

export const getExpirations = () => async (dispatch) => {
  try {
    const res = await axios.get(backendUrl + "/api/stock/getExpirations");

    dispatch({
      type: GET_EXPIRATIONS,
      payload: { expirations: res.data.expirations },
    });
  } catch (error) {
    console.log(error);
  }
};

export const getSymbolLists = () => async (dispatch) => {
  try {
    const res = await axios.get(backendUrl + "/api/stock/getSymbolLists");

    dispatch({
      type: GET_SYMBOLLISTS,
      payload: { symbolLists: res.data.symbolLists },
    });
  } catch (error) {
    console.log(error);
  }
};

export const uploadExpirations = (data) => async (dispatch) => {
  axios
    .post(backendUrl + "/api/stock/uploadExpirations", data)
    .then((res) => {
      const { expirations } = res.data;

      dispatch({
        type: GET_EXPIRATIONS,
        payload: { expirations },
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const uploadSymbolLists = (data, callback) => async (dispatch) => {
  axios
    .post(backendUrl + "/api/stock/uploadSymbolLists", data)
    .then((res) => {
      const { symbolLists } = res.data;

      dispatch({
        type: GET_SYMBOLLISTS,
        payload: { symbolLists },
      });

      callback && callback();
    })
    .catch((err) => {
      console.log(err);
      callback && callback();
    });
};

export const getCategory = (user) => async (dispatch) => {
  try {
    const res = await axios.post(backendUrl + "/api/stock/getCategory", user);
    const categories = res.data.categories;

    dispatch({
      type: GET_CATEGORY,
      payload: { categories },
    });
  } catch (err) {
    console.log(err);
  }
};

export const addCategory = (user) => async (dispatch) => {
  try {
    const res = await axios.post(backendUrl + "/api/stock/addCategory", user);

    if (res.data.message) {
      //if the same category already exists
      return false;
    }

    const categories = res.data.categories;

    dispatch({
      type: GET_CATEGORY,
      payload: { categories },
    });

    return true;
  } catch (err) {
    console.log(err);
  }
};

export const updateCategory = (data) => async (dispatch) => {
  try {
    const res = await axios.post(
      backendUrl + "/api/stock/updateCategory",
      data
    );

    if (res.data.message) {
      //if the same category already exists
      return false;
    }

    const categories = res.data.categories;

    dispatch({
      type: GET_CATEGORY,
      payload: { categories },
    });

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const deleteCategory = (data) => async (dispatch) => {
  try {
    const res = await axios.post(
      backendUrl + "/api/stock/deleteCategory",
      data
    );

    if (res.data.message) {
      //if the same category already exists
      return false;
    }

    const categories = res.data.categories;

    dispatch({
      type: GET_CATEGORY,
      payload: { categories },
    });

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const setSelectedSymbolsForCalcuation = (data) => async (dispatch) => {
  const symbols = data.symbols;

  dispatch({
    type: SET_SELECTED_SYMBOLS_FOR_CALCULATION,
    payload: { symbols },
  });
};

export const setOTMPercentages = (data) => async (dispatch) => {
  const percentages = data.percentages;

  dispatch({
    type: SET_OTM_PERCENTAGES,
    payload: { percentages },
  });
};

export const getWeeklyExpiryDates = (data, callback) => async (dispatch) => {
  try {
    const res = await axios.post(
      backendUrl + "/api/stock/getWeeklyExpiryDates",
      data
    );

    callback && callback();

    const { weeklyExpiryDates } = res.data;

    dispatch({
      type: SET_WEEKLY_EXPIRY_DATES,
      payload: { weeklyExpiryDates },
    });
  } catch (error) {
    console.log(error.message);

    callback && callback();
  }
};

export const getBasicResult = (data, callback) => async (dispatch) => {
  try {
    const res = await axios.post(
      backendUrl + "/api/stock/getBasicResult",
      data
    );

    const { basicFilterResult } = res.data;

    dispatch({
      type: GET_BASIC_FILTER_RESULTS,
      payload: { basicFilterResult },
    });

    callback && callback();
  } catch (error) {
    console.log(error.message);
    callback && callback();
  }
};
