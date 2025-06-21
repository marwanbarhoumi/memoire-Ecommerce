import { combineReducers } from "redux";
import {authReducer} from "./authreducer"
import { productreducers } from "./productreducer";
import { reviewreducers } from "./reviewreducer";
import {clientReducer} from "./clientReducer";
import { cartReducer } from "./cartreducer";
import {commandeReducer} from "./commandeReducer";

export const rootReducer = combineReducers({
  auth: authReducer,
  prod: productreducers,
  client: clientReducer,
  rev: reviewreducers,
  cart: cartReducer,
  commande: commandeReducer,
  
});
