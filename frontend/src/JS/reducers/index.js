import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import { productreducers } from "./productreducer";
import { reviewreducers } from "./reviewreducer";
import {clientReducer} from "./clientReducer";
import { cartReducer } from "./cartreducer";

export const rootReducer = combineReducers({
  auth: authReducer,
  prod: productreducers,
  client: clientReducer,
  rev: reviewreducers,
  cart: cartReducer,
  
});
