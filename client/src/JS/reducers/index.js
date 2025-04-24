import { combineReducers } from "redux";
import { authreducer } from "./authreducer";
import { productreducers } from "./productreducer";
import { reviewreducers } from "./reviewreducer";
import {clientReducer} from "./clientReducer";
import { cartReducer } from "./cartreducer";

export const rootReducer = combineReducers({
  auth: authreducer,
  prod: productreducers,
  client: clientReducer,
  rev: reviewreducers,
  cart: cartReducer,
  
});
