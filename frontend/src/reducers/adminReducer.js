import { GET_ANALYTICS_DATA } from "../actions/types";

const initialState = {
  activeUsers: [],
  newAccounts: [],
  pagesClicked: [],
  tickersSearched: [],
  pageClickCounts: [],
  freeUsers: [],
  paidUsers: [],
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ANALYTICS_DATA:
      const {
        activeUsers,
        newAccounts,
        pagesClicked,
        tickersSearched,
        freeUsers,
        paidUsers,
      } = action.payload;

      return {
        ...state,
        activeUsers: activeUsers,
        newAccounts: newAccounts,
        pagesClicked: pagesClicked,
        tickersSearched: tickersSearched,
        freeUsers,
        paidUsers,
      };

    default:
      return state;
  }
};

export default adminReducer;
