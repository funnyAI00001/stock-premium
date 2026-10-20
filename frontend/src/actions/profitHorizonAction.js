import axios from "axios";
import {
  SYMBOL_NOT_FOUND_ERROR,
  OPTIONS_NOT_FOUND_ERROR,
  SERVICE_UNAVAILABLE_ERROR,
  SERVER_ERROR,
  GET_PROFIT_HORIZON,
  SET_CALL_CALCULATIONLIMIT,
  SET_OTM_PERCENTAGES_FOR_PROFIT,
  SET_CLEAR_RESULT_FOR_PROFIT,
} from "./types";
import { backendUrl } from "../config/url";

export const getProfitHorizon = (data, callback) => async (dispatch) => {
  dispatch({
    type: SET_OTM_PERCENTAGES_FOR_PROFIT,
    payload: {
      otm1Percentage: data.otm1Percentage,
      otm2Percentage: data.otm2Percentage,
      daysInFuture: data.daysInFuture,
      weeklyOption: data.weeklyOption,
    },
  });

  try {
    await axios
      .post(backendUrl + "/api/profitHorizon/getProfitHorizon", data)
      .then((res) => {
        const {
          sharePrice,
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
          expiration_dates,
          indicesWithinTenDays,
          indicesWithNoData,
        } = res.data;

        dispatch({
          type: GET_PROFIT_HORIZON,
          payload: {
            sharePrice,
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
            expiration_dates,
            symbol: data.symbol,
            indicesWithinTenDays,
            indicesWithNoData,
          },
        });
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
      })
      .finally(() => {
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

export const clearResult = () => (dispatch) => {
  dispatch({
    type: SET_CLEAR_RESULT_FOR_PROFIT,
  });
};
