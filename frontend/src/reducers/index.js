import { combineReducers } from "redux";
import authReducer from "./authReducer";
import stockReducer from "./stockReducer";
import stripeReducer from "./stripeReducer";
import adminReducer from "./adminReducer";
import profitHorizonReducer from "./profitHorizon";

export default combineReducers({
  auth: authReducer,
  stock: stockReducer,
  stripe: stripeReducer,
  admin: adminReducer,
  profitHorizon: profitHorizonReducer,
});
