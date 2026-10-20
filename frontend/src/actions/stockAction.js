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
  SET_SELECTED_SYMBOLS_FOR_PUT,
  SET_OTM_PERCENTAGES,
  SET_WEEKLY_EXPIRY_DATES,
  GET_SYMBOLLISTS,
  GET_BASIC_FILTER_RESULTS,
  SET_SYMBOLS_FOR_OPTIONS_FILTER,
  GET_OPTIONS_FILTER_RESULT,
  GET_STOCKS,
  GET_SEARCH_FILTER_RESULTS,
  GET_CASH_SECURED_PUTS,
  SET_OTM_ITM_PERCENTAGES,
  SET_FOUND_STOCK,
  SET_FOUND_OPTION,
  SET_SIDE,
  SET_CALL_CALCULATIONLIMIT,
  SET_PUT_CALCULATIONLIMIT,
  SET_SCREENER_CALCULATIONLIMIT,
  GET_MARKET_STATUS,
} from "./types";
import { backendUrl } from "../config/url";

export const getCoveredCallPremium = (data, callback) => async (dispatch) => {
  try {
    await axios
      .post(backendUrl + "/api/stock/getCoveredcallPremium", data, {
        withCredentials: true,
      })
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
          available_symbols,
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
            available_symbols,
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
          } else if (err.response && err.response.status === 403) {
            dispatch({
              type: SET_CALL_CALCULATIONLIMIT,
              payload: { value: true },
            });
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

export const addCategory = (user, callback) => async (dispatch) => {
  try {
    const res = await axios.post(backendUrl + "/api/stock/addCategory", user);

    if (res.data.message) {
      //if the same category already exists
      // return false;
      callback && callback(false);

      return;
    }

    const categories = res.data.categories;

    dispatch({
      type: GET_CATEGORY,
      payload: { categories },
    });

    // return true;
    callback && callback(true);
  } catch (err) {
    console.log(err);
    callback && callback(true);
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

export const setSelectedSymbolsForCalculation = (data) => async (dispatch) => {
  const symbols = data.symbols;

  dispatch({
    type: SET_SELECTED_SYMBOLS_FOR_CALCULATION,
    payload: { symbols },
  });
};

export const setSelectedSymbolsForPut = (data) => async (dispatch) => {
  const symbols = data.symbols;

  dispatch({
    type: SET_SELECTED_SYMBOLS_FOR_PUT,
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
      data,
      { withCredentials: true }
    );

    const { basicFilterResult } = res.data;

    dispatch({
      type: GET_BASIC_FILTER_RESULTS,
      payload: { basicFilterResult },
    });

    dispatch({
      type: SET_FOUND_STOCK,
    });

    callback && callback();
  } catch (error) {
    if (error.response && error.response.status === 403) {
      dispatch({
        type: SET_SCREENER_CALCULATIONLIMIT,
        payload: { value: true },
      });
    }
    console.log(error.message);
    callback && callback();
  }
};

export const set_Symbols_For_Optionsfilter = (symbols) => async (dispatch) => {
  dispatch({
    type: SET_SYMBOLS_FOR_OPTIONS_FILTER,
    payload: { symbols },
  });
};

export const getOptions = (data, callback) => async (dispatch) => {
  try {
    const res = await axios.post(backendUrl + "/api/stock/getOptions", data);
    const { optionFilterResult } = res.data;

    dispatch({
      type: GET_OPTIONS_FILTER_RESULT,
      payload: { optionFilterResult },
    });

    dispatch({
      type: SET_FOUND_OPTION,
    });

    callback && callback();
  } catch (error) {
    callback && callback();
    console.log(error.message);
  }
};

export const getStocks = () => async (dispatch) => {
  try {
    const res = await axios.get(backendUrl + "/api/stock/getStocks");
    const { stocks } = res.data;

    dispatch({
      type: GET_STOCKS,
      payload: { stocks },
    });
  } catch (error) {
    console.log(error);
  }
};

export const getSearchResult = (data, callback) => async (dispatch) => {
  try {
    const res = await axios.post(
      backendUrl + "/api/stock/getSearchResult",
      data
    );

    const { searchFilterResult } = res.data;

    dispatch({
      type: GET_SEARCH_FILTER_RESULTS,
      payload: { searchFilterResult },
    });

    callback && callback();
  } catch (error) {
    console.log(error.message);
    callback && callback();
  }
};

export const getCashSecuredPuts = (data, callback) => async (dispatch) => {
  try {
    await axios
      .post(backendUrl + "/api/stock/getCashSecuredPuts", data, {
        withCredentials: true,
      })
      .then((res) => {
        const {
          sharePrices,
          ATMs,
          OTMs,
          ITMs,
          strikeATMs,
          strikeOTMs,
          strikeITMs,
          expiration_date,
          available_symbols,
        } = res.data;

        dispatch({
          type: GET_CASH_SECURED_PUTS,
          payload: {
            sharePrices2: sharePrices,
            ATMs2: ATMs,
            OTMs,
            ITMs,
            strikeATMs2: strikeATMs,
            strikeOTMs,
            strikeITMs,
            expiration_date2: expiration_date,
            available_symbols2: available_symbols,
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
          } else if (err.response && err.response.status === 403) {
            dispatch({
              type: SET_PUT_CALCULATIONLIMIT,
              payload: { value: true },
            });
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

export const setOTMITMPercentages = (data) => async (dispatch) => {
  const percentages = data.percentages;

  dispatch({
    type: SET_OTM_ITM_PERCENTAGES,
    payload: { percentages2: percentages },
  });
};

export const set_Side = (data) => async (dispatch) => {
  dispatch({
    type: SET_SIDE,
    payload: { side: data.side },
  });
};

export const getMarketStatus = () => async (dispatch) => {
  try {
    const res = await axios.get(backendUrl + "/api/stock/getMarketStatus");

    const { marketStatus } = res.data;

    dispatch({
      type: GET_MARKET_STATUS,
      payload: { marketStatus },
    });
  } catch (error) {
    console.log(error);
  }
};
