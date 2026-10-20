import { combineReducers } from "redux";
import authReducer from "./authReducer";
import stockReducer from "./stockReducer";
import stripeReducer from "./stripeReducer";

export default combineReducers({
  auth: authReducer,
  stock: stockReducer,
  stripe: stripeReducer,
});
