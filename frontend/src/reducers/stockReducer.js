import {
  GET_COVEREDCALLPREMIUM,
  OPTIONS_NOT_FOUND_ERROR,
  SYMBOL_NOT_FOUND_ERROR,
  SERVICE_UNAVAILABLE_ERROR,
  GET_EXPIRATIONS,
  SERVER_ERROR,
  GET_CATEGORY,
  UPDATE_CATEGORY,
  SET_SELECTED_SYMBOLS_FOR_CALCULATION,
  SET_OTM_PERCENTAGES,
  SET_WEEKLY_EXPIRY_DATES,
  GET_SYMBOLLISTS,
  GET_BASIC_FILTER_RESULTS,
} from "../actions/types";

const initialState = {
  sharePrices: [],
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
  symbol_not_found_error_message: false,
  options_not_found_error_message: false,
  service_error: false,
  expirations: [],
  expiration_date: "",
  server_error: false,
  categories: [],
  selectedSymbolsForCalculation: [],
  OTM1percentage: 5,
  OTM2percentage: 10,
  weekly_expiry_dates: [],
  symbolLists: [],
  basicFilterResult: [],
  available_symbols: [], // available symbols in the backend
};

const stockReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COVEREDCALLPREMIUM:
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
      } = action.payload;

      return {
        ...state,
        sharePrices: sharePrices,
        ATMs: ATMs,
        OTM5s: OTM5s,
        OTM10s: OTM10s,
        strikeATMs: strikeATMs,
        strikeOTM5s: strikeOTM5s,
        strikeOTM10s: strikeOTM10s,
        ROIs: ROIs,
        annualROIs: annualROIs,
        OTM5ROIs: OTM5ROIs,
        OTM5annualROIs: OTM5annualROIs,
        OTM10ROIs: OTM10ROIs,
        OTM10annualROIs: OTM10annualROIs,
        expiration_date: expiration_date,
        available_symbols: available_symbols,
      };

    case SYMBOL_NOT_FOUND_ERROR:
      return {
        ...state,
        symbol_not_found_error_message: action.payload.message,
      };

    case OPTIONS_NOT_FOUND_ERROR:
      return {
        ...state,
        options_not_found_error_message: action.payload.message,
      };

    case GET_EXPIRATIONS:
      return {
        ...state,
        expirations: action.payload.expirations,
      };

    case GET_SYMBOLLISTS:
      return {
        ...state,
        symbolLists: action.payload.symbolLists,
      };

    case SERVICE_UNAVAILABLE_ERROR:
      return {
        ...state,
        service_error: action.payload.message,
      };

    case SERVER_ERROR:
      return {
        ...state,
        server_error: action.payload.message,
      };

    case GET_CATEGORY:
      return {
        ...state,
        categories: action.payload.categories,
      };

    case UPDATE_CATEGORY:
      return {
        ...state,
        categories: action.payload.categories,
      };

    case SET_SELECTED_SYMBOLS_FOR_CALCULATION:
      return {
        ...state,
        selectedSymbolsForCalculation: action.payload.symbols,
      };

    case SET_OTM_PERCENTAGES:
      const { percentages } = action.payload;

      return {
        ...state,
        OTM1percentage: percentages[0],
        OTM2percentage: percentages[1],
      };

    case SET_WEEKLY_EXPIRY_DATES:
      const { weeklyExpiryDates } = action.payload;

      return {
        ...state,
        weekly_expiry_dates: weeklyExpiryDates,
      };

    case GET_BASIC_FILTER_RESULTS:
      const { basicFilterResult } = action.payload;

      return {
        ...state,
        basicFilterResult: basicFilterResult,
      };

    default:
      return state;
  }
};

export default stockReducer;
