import {
  GET_PROFIT_HORIZON,
  SET_OTM_PERCENTAGES_FOR_PROFIT,
  SET_CLEAR_RESULT_FOR_PROFIT
} from "../actions/types";

const initialState = {
  symbols: [],
  sharePrice: [],
  ATMs: [],
  OTM5s: [],
  OTM10s: [],
  strikeATMs: [],
  strikeOTM5s: [],
  strikeOTM10s: [],
  ROIs: [],
  annualROIs: [],
  OTM5ROIs: [],
  OTM5annualROIs: [],
  OTM10ROIs: [],
  OTM10annualROIs: [],
  expiration_dates: [],
  indicesWithinTenDays: [],
  indicesWithNoData: [],
  otm1Percentage: 5,
  otm2Percentage: 10,
  gotFirstResult: false,
  daysInFuture: 90,
  weeklyOption: false,
};

const profitHorizonReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PROFIT_HORIZON:
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
        symbol
      } = action.payload;      

      return {
        ...state,
        sharePrice: [...state.sharePrice, sharePrice],
        ATMs: [...state.ATMs, ATMs],
        OTM5s: [...state.OTM5s, OTM5s],
        OTM10s: [...state.OTM10s, OTM10s],
        strikeATMs: [...state.strikeATMs, strikeATMs],
        strikeOTM5s: [...state.strikeOTM5s, strikeOTM5s],
        strikeOTM10s: [...state.strikeOTM10s, strikeOTM10s],
        ROIs: [...state.ROIs, ROIs],
        annualROIs: [...state.annualROIs, annualROIs],
        OTM5ROIs: [...state.OTM5ROIs, OTM5ROIs],
        OTM5annualROIs: [...state.OTM5annualROIs, OTM5annualROIs],
        OTM10ROIs: [...state.OTM10ROIs, OTM10ROIs],
        OTM10annualROIs: [...state.OTM10annualROIs, OTM10annualROIs],
        expiration_dates: [...state.expiration_dates, expiration_dates],
        indicesWithinTenDays: [...state.indicesWithinTenDays, indicesWithinTenDays],
        indicesWithNoData: [...state.indicesWithNoData, indicesWithNoData],
        symbols: [...state.symbols, symbol],
        gotFirstResult: true,
      };

    case SET_OTM_PERCENTAGES_FOR_PROFIT:
      const { otm1Percentage, otm2Percentage, daysInFuture, weeklyOption } =
        action.payload;

      return {
        ...state,
        otm1Percentage,
        otm2Percentage,
        daysInFuture,
        weeklyOption,
      };

    case SET_CLEAR_RESULT_FOR_PROFIT:
      return initialState;

    default:
      return state;
  }
};

export default profitHorizonReducer;
