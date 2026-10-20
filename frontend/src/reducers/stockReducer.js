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
  SET_SYMBOLS_FOR_OPTIONS_FILTER,
  GET_OPTIONS_FILTER_RESULT,
  GET_STOCKS,
  GET_SEARCH_FILTER_RESULTS,
  GET_CASH_SECURED_PUTS,
  SET_OTM_ITM_PERCENTAGES,
  SET_FOUND_STOCK,
  SET_FOUND_OPTION,
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
  symbolsForOptionsFilter: [],
  optionFilterResult: { symbols: [] },
  stocks: [],
  searchFilterResult: [],
  OTMs: [],
  ITMs: [],
  strikeOTMs: [],
  strikeITMs: [],
  OTMpercentage: 5,
  ITMpercentage: 5,
  bFoundStock: false,
  bFoundOptions: false,
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

    case SET_SYMBOLS_FOR_OPTIONS_FILTER:
      const { symbols } = action.payload;

      return {
        ...state,
        symbolsForOptionsFilter: symbols,
      };

    case GET_OPTIONS_FILTER_RESULT:
      const { optionFilterResult } = action.payload;

      return {
        ...state,
        optionFilterResult: optionFilterResult,
      };

    case GET_STOCKS:
      const { stocks } = action.payload;

      return {
        ...state,
        stocks: stocks,
      };

    case GET_SEARCH_FILTER_RESULTS:
      const { searchFilterResult } = action.payload;

      return {
        ...state,
        searchFilterResult: searchFilterResult,
      };

    case GET_CASH_SECURED_PUTS:
      const {
        sharePrices2,
        ATMs2,
        OTMs,
        ITMs,
        strikeATMs2,
        strikeOTMs,
        strikeITMs,
        expiration_date2,
        available_symbols2,
      } = action.payload;

      return {
        ...state,
        sharePrices: sharePrices2,
        ATMs: ATMs2,
        OTMs: OTMs,
        ITMs: ITMs,
        strikeATMs: strikeATMs2,
        strikeOTMs: strikeOTMs,
        strikeITMs: strikeITMs,
        expiration_date: expiration_date2,
        available_symbols: available_symbols2,
      };

    case SET_OTM_ITM_PERCENTAGES:
      const { percentages2 } = action.payload;

      return {
        ...state,
        OTMpercentage: percentages2[0],
        ITMpercentage: percentages2[1],
      };

    case SET_FOUND_STOCK:
      return {
        ...state,
        bFoundStock: true,
      };

    case SET_FOUND_OPTION:
      return {
        ...state,
        bFoundOption: true,
      };

    default:
      return state;
  }
};

export default stockReducer;
